import test from 'node:test';
import assert from 'node:assert/strict';
import {metroNames,metroWeights,metroDraws,metroTransition,metroMatrix,metroCreate,metroStep,metroRestore,metroComplete} from '../src/metropolis-light.js';
test('all proposals and draws implement the acceptance rule and detailed balance',()=>{
 for(const current of metroNames)for(const direction of ['left','right'])for(const draw of metroDraws){const r=metroTransition(current,direction,draw);assert.equal(r.alpha,Math.min(1,metroWeights[r.candidate]/metroWeights[current]));assert.equal(r.next,draw<r.alpha?r.candidate:current);}
 const p=metroMatrix();for(let i=0;i<4;i++){assert.equal(Object.values(p[i]).reduce((a,b)=>a+b,0),1);for(let j=0;j<4;j++)assert.equal(metroWeights[metroNames[i]]*p[i][metroNames[j]],metroWeights[metroNames[j]]*p[j][metroNames[i]]);}
 assert.equal(metroTransition('C','right',0.25).accepted,false);assert.equal(metroTransition('C','right',0).accepted,true);
});
test('partial trials restore and all cases and reflections are required',()=>{
 const q=metroCreate();q.direction='right';q.draw=0;assert.deepEqual(metroRestore(q),q);metroStep(q);
 for(const [start,direction,draw] of [['B','left',0.25],['B','left',0.75],['C','right',0.25]]){q.start=start;q.actions=[];q.direction=direction;q.draw=draw;metroStep(q);}
 q.acceptance='reject';assert.equal(metroComplete(q),false);q.stationary='conditional';assert.equal(metroComplete(q),true);assert.throws(()=>metroRestore({...q,actions:[{direction:'up',draw:0}]}));
});
