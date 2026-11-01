import test from 'node:test';
import assert from 'node:assert/strict';
import {rocCases,rocThresholds,rocTruth,rocPoint,rocRanking,rocCurvePoints,createRocCurve,rocCurveComplete,restoreRocCurve} from '../src/roc-curve.js';

test('all thresholds yield independent confusion counts and ROC areas match pair ranking',()=>{
 for(const id of Object.keys(rocCases)){
  for(const threshold of rocThresholds){const r=rocPoint(id,threshold);const predicted=rocCases[id].map(score=>score>=threshold);assert.equal(r.tp,predicted.filter((x,i)=>x&&rocTruth[i]).length);assert.equal(r.fp,predicted.filter((x,i)=>x&&!rocTruth[i]).length);assert.equal(r.tpr,r.tp/2);assert.equal(r.fpr,r.fp/2);}
  const points=rocCurvePoints(id);let area=0;for(let i=1;i<points.length;i++){assert.ok(points[i].fpr>=points[i-1].fpr);assert.ok(points[i].tpr>=points[i-1].tpr);area+=(points[i].fpr-points[i-1].fpr)*(points[i].tpr+points[i-1].tpr)/2;}assert.equal(area,rocRanking(id).auc);
 }
 assert.equal(rocRanking('crossed').auc,.75);assert.equal(rocRanking('tied').auc,.875);assert.equal(rocRanking('tied').pairs.filter(p=>p.credit===.5).length,1);
});
test('required observations and interpretation survive restoring',()=>{
 const s=createRocCurve();s.observed=['crossed,10','crossed,7','crossed,2','tied,10','tied,5','tied,1'];s.answer='ranking';s.checked=true;const copy=restoreRocCurve(s);assert.equal(rocCurveComplete(copy),true);copy.observed.pop();assert.equal(s.observed.length,6);assert.equal(rocCurveComplete(copy),false);assert.throws(()=>restoreRocCurve({...s,observed:['tied,5','tied,5']}));
});
