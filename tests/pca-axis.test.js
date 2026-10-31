import test from 'node:test';
import assert from 'node:assert/strict';
import {pcaCases,pcaDirections,pcaResult,createPca,pcaCorrect,pcaComplete,restorePca} from '../src/pca-axis.js';

test('projection errors agree with covariance eigenvalue bounds',()=>{
 const expected={diagonal:{x:10,y:10,diagonal:2,anti:18},horizontal:{x:4,y:16,diagonal:10,anti:10}};
 for(const id of Object.keys(pcaCases)){
  for(const direction of Object.keys(pcaDirections)){const r=pcaResult(id,direction);assert.equal(r.error,expected[id][direction]);assert.equal(r.error+r.captured,20);for(const row of r.rows){const v=pcaDirections[direction].v;assert.equal((row.point[0]-row.projection[0])*v[0]+(row.point[1]-row.projection[1])*v[1],0);}}
  const points=pcaCases[id].points;
  for(let i=0;i<360;i++){const a=i*Math.PI/180,v=[Math.cos(a),Math.sin(a)];const error=points.reduce((sum,p)=>{const dot=p[0]*v[0]+p[1]*v[1];return sum+p[0]**2+p[1]**2-dot**2;},0);assert.ok(error>=expected[id][pcaCases[id].best]-1e-9);}
 }
 assert.throws(()=>pcaResult('unknown','x'));assert.throws(()=>pcaResult('diagonal','unknown'));
});

test('completion requires all trials, correct explanation, and a checked answer',()=>{
 const s=createPca();for(const [id,c] of Object.entries(pcaCases)){const t=s.trials[id];t.attempts=Object.keys(pcaDirections);t.choice=c.best;t.reason='samples';assert.equal(pcaCorrect(id,t),false);t.reason='eigenbound';assert.equal(pcaCorrect(id,t),true);t.checked=true;}
 assert.equal(pcaComplete(s),true);assert.deepEqual(restorePca(s),s);const copy=restorePca(s);copy.trials.diagonal.attempts.pop();assert.equal(pcaComplete(copy),false);assert.equal(s.trials.diagonal.attempts.length,4);assert.throws(()=>restorePca({...s,selected:'wrong'}));assert.throws(()=>restorePca({...s,trials:{...s.trials,diagonal:{...s.trials.diagonal,attempts:['x','x']}}}));
});
