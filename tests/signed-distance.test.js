import test from 'node:test';
import assert from 'node:assert/strict';
import {distancePoints,distanceCases,signedDistance,implicitValue,distanceExpected,distanceCreate,distanceCorrect,distanceComplete,distanceRestore} from '../src/signed-distance.js';

test('distance is the signed closest distance to the radius-two circle',()=>{
 for(const {x,y} of distancePoints){const d=signedDistance(x,y), r=Math.hypot(x,y), f=implicitValue(x,y);assert.ok(Math.abs(Math.abs(d)-Math.abs(r-2))<1e-12);assert.equal(Math.sign(d),Math.sign(f));if(r){const bx=2*x/r,by=2*y/r;assert.ok(Math.abs(Math.hypot(x-bx,y-by)-Math.abs(d))<1e-12);}}
 assert.equal(signedDistance(0,0),-2);assert.equal(implicitValue(0,0),-4);assert.equal(signedDistance(2,0),0);assert.ok(Math.abs(signedDistance(2,2)-(Math.sqrt(8)-2))<1e-12);
});
test('all grid points belong to exactly one case, and each case needs the exact set',()=>{
 const sets=Object.keys(distanceCases).map(id=>distanceExpected(id));assert.deepEqual(sets.map(a=>a.length),[9,4,12]);assert.deepEqual(sets.flat().sort((a,b)=>a-b),Array.from({length:25},(_,i)=>i));
 for(const id of Object.keys(distanceCases)){const points=distanceExpected(id);assert.equal(distanceCorrect({points,checked:false},id),false);assert.equal(distanceCorrect({points,checked:true},id),true);for(let i=0;i<25;i++){const changed=points.includes(i)?points.filter(n=>n!==i):[...points,i];assert.equal(distanceCorrect({points:changed,checked:true},id),false);}}
});
test('completion requires all classifications and correct checked comparison; drafts are validated and copied',()=>{
 const s=distanceCreate();for(const id of Object.keys(distanceCases))s.trials[id]={points:distanceExpected(id),checked:true};assert.equal(distanceComplete(s),false);s.answer='different';s.answerChecked=true;assert.equal(distanceComplete(s),true);const copy=distanceRestore(s);copy.trials.inside.points.pop();assert.equal(distanceComplete(copy),false);assert.equal(distanceComplete(s),true);s.trials.inside.points=[1,1];assert.throws(()=>distanceRestore(s));assert.throws(()=>distanceRestore({...distanceCreate(),answer:'bad'}));
});
