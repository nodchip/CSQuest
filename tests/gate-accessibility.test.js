import {test} from 'node:test';
import assert from 'node:assert/strict';
import {gateOutcome,gateCreate,gateCheck,gateComplete,gateRestore} from '../src/gate-accessibility.js';

test('all combinations distinguish visible cues, names and keyboard reachability',()=>{
 for(let mask=0;mask<8;mask++){
  assert.equal(gateOutcome(mask,'color'),(mask&1)?'clear':'ambiguous');
  assert.equal(gateOutcome(mask,'reader'),!(mask&4)?'unreachable':(mask&2)?'clear':'ambiguous');
  assert.equal(gateOutcome(mask,'keyboard'),(mask&4)?'clear':'unreachable');
 }
 assert.throws(()=>gateOutcome(8,'color'));assert.throws(()=>gateOutcome(0,'other'));
});
test('baseline and revised design require all three correctly predicted comparisons',()=>{
 const q=gateCreate();for(const mask of [0,7])for(const person of ['color','reader','keyboard']){
  q.mask=mask;q.person=person;const correct=gateOutcome(mask,person);assert.throws(()=>gateCheck(q,correct==='clear'?'ambiguous':'clear'));gateCheck(q,correct);gateCheck(q,correct);assert.deepEqual(gateRestore(q),q);
 }
 assert.equal(q.checks.length,6);assert(!gateComplete(q));q.answer='different';assert(gateComplete(q));
 const bad=structuredClone(q);bad.checks[0].guess='clear';assert.throws(()=>gateRestore(bad));bad.checks=Array(25).fill({mask:0,person:'color',guess:'ambiguous'});assert.throws(()=>gateRestore(bad));
});
