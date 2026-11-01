import test from 'node:test';
import assert from 'node:assert/strict';
import {bellGateNames,applyBellGate,runBellGates,bellTargetMatches,createBellGates,bellGatesAct,bellGatesComplete,restoreBellGates} from '../src/bell-gates.js';

function act(s,a){const r=bellGatesAct(s,a);assert.equal(r.ok,true,r.message);return r.state;}
const close=(a,b)=>a.forEach((x,i)=>assert.ok(Math.abs(x-b[i])<1e-10));
test('controlled NOT depends on its control and the order of H and controlled NOT matters',()=>{
 close(applyBellGate([0,0,1,0],'ab'),[0,0,0,1]);
 close(applyBellGate([0,1,0,0],'ab'),[0,1,0,0]);
 close(applyBellGate([0,1,0,0],'ba'),[0,0,0,1]);
 assert.equal(bellTargetMatches(runBellGates(['ha','ab']).at(-1),'plus'),true);
 assert.equal(bellTargetMatches(runBellGates(['ab','ha']).at(-1),'plus'),false);
 assert.equal(bellTargetMatches(runBellGates(['ha','ab','za']).at(-1),'minus'),true);
 assert.equal(bellTargetMatches(runBellGates(['ha','ab','xb']).at(-1),'opposite'),true);
 assert.equal(bellTargetMatches(runBellGates(['ha','ab']).at(-1),'minus'),false);
 assert.equal(bellTargetMatches(runBellGates(['ha','ab']).at(-1).map(x=>-x),'plus'),true);
});
test('all gate sequences of length four preserve norm and each gate is self-inverse',()=>{
 let states=[[1,0,0,0]];
 for(let depth=0;depth<4;depth++){
  const next=[];for(const state of states)for(const gate of Object.keys(bellGateNames)){
   const result=applyBellGate(state,gate);assert.ok(Math.abs(result.reduce((s,x)=>s+x*x,0)-1)<1e-10);close(applyBellGate(result,gate),state);next.push(result);
  }states=next;
 }
 assert.throws(()=>runBellGates(Array(6).fill('ha')),RangeError);
});
test('all three states and correct reflection are needed; history restores the experiment',()=>{
 let s=createBellGates();
 for(const a of ['add:ab','add:ha','run'])s=act(s,a);
 assert.deepEqual(s.solved,[]);
 for(const a of ['clear','add:ha','add:ab','run','target:minus','add:ha','add:ab','add:za','run','target:opposite','add:ha','add:ab','add:xb','run','answer:probability','check'])s=act(s,a);
 assert.equal(bellGatesComplete(s),false);
 s=act(s,'answer:phase');s=act(s,'check');assert.equal(bellGatesComplete(s),true);
 assert.deepEqual(restoreBellGates(JSON.parse(JSON.stringify(s))),s);
 assert.throws(()=>restoreBellGates({history:['undo']}),RangeError);
});
