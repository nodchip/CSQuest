import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assessSequence,createSequence,sequenceComplete,restoreSequence} from '../src/message-sequence.js';
test('normal and insufficient-stock traces require the correct sender, receiver and order',()=>{
 const normal=['request','check','allowed','withdraw','done','reply'],short=['request','check','denied','reply'];
 for(const [id,steps] of [['enough',normal],['short',short]]){assert.equal(assessSequence(id,steps).ok,true);for(let i=0;i<steps.length;i++){assert.equal(assessSequence(id,steps.slice(0,i)).ok,false);const swapped=[...steps];swapped[i]='request'===steps[i]?'reply':'request';assert.equal(assessSequence(id,swapped).ok,false);}assert.equal(assessSequence(id,[...steps,'reply']).ok,false);}
 assert.equal(assessSequence('short',['request','check','denied','withdraw','reply']).ok,false);assert.throws(()=>assessSequence('short',['unknown']),RangeError);
});
test('saved traces are validated, independent and must be checked before completion',()=>{
 const s=createSequence();s.enough={steps:['request','check','allowed','withdraw','done','reply'],checked:true};s.short={steps:['request','check','denied','reply'],checked:true};const copy=restoreSequence(s);assert.equal(sequenceComplete(copy),true);s.short.steps.push('withdraw');assert.equal(sequenceComplete(copy),true);assert.equal(sequenceComplete(s),false);copy.short.checked=false;assert.equal(sequenceComplete(copy),false);assert.throws(()=>restoreSequence({...s,short:{steps:['bad'],checked:true}}),RangeError);
});
