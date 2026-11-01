import test from 'node:test';
import assert from 'node:assert/strict';
import {timingDoors,inspectTimingGate,timingEvidence,createTimingGates,recordTimingAttempt,timingGatesComplete,restoreTimingGates} from '../src/timing-gates.js';
test('all 16 guesses per door produce the same accept decision while early counts reveal first mismatch',()=>{
 const secrets={sun:'1011',moon:'0110'};
 for(const door of Object.keys(timingDoors))for(let guess=0;guess<16;guess++){
  const bits=guess.toString(2).padStart(4,'0'),first=[...bits].findIndex((b,i)=>b!==secrets[door][i]),early=inspectTimingGate(door,'early',guess),full=inspectTimingGate(door,'full',guess);
  assert.equal(early.accepted,first<0);assert.equal(full.accepted,early.accepted);assert.equal(early.compared,first<0?4:first+1);assert.equal(full.compared,4);
 }
});
test('evidence needs the same two rejected guesses in both modes and an opened gate',()=>{
 let s=createTimingGates();for(const door of Object.keys(timingDoors)){s.door=door;for(const mode of ['early','full'])for(let guess=0;guess<16;guess++){s.mode=mode;s.guess=guess;s=recordTimingAttempt(s);}assert.deepEqual(timingEvidence(s.records,door),{opened:true,paired:true});}
 assert.equal(s.records.length,64);s=recordTimingAttempt(s);assert.equal(s.records.length,64);s.answer='limited';s.checked=true;assert.ok(timingGatesComplete(restoreTimingGates(s)));
 assert.throws(()=>restoreTimingGates({...s,records:[s.records[0],s.records[0]]}));
});
test('constant count evidence is not awarded for unrelated or accepted guesses',()=>{
 const records=[{door:'sun',mode:'early',guess:0},{door:'sun',mode:'full',guess:0},{door:'sun',mode:'early',guess:11},{door:'sun',mode:'full',guess:11}];
 assert.deepEqual(timingEvidence(records,'sun'),{opened:true,paired:false});
});
