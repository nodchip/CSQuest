import test from 'node:test';
import assert from 'node:assert/strict';
import {createProof,toggleProof,applyProof,counterResult,createProofSet,restoreProof,proofComplete} from '../src/logic-proof.js';
const apply=(s,a,b)=>applyProof(toggleProof(toggleProof(s,a),b));
test('each allowed inference is sound for all assignments satisfying its premises',()=>{
  for(let mask=0;mask<8;mask++){const sun=!!(mask&1),rune=!!(mask&2),door=!!(mask&4);if(sun&&(!sun||rune))assert.equal(rune,true);if(rune&&(!rune||door))assert.equal(door,true);}
  let s=createProof();s=apply(s,'sunRune','sun');assert.ok(s.facts.includes('rune'));s=apply(s,'runeDoor','rune');assert.ok(s.facts.includes('door'));
});
test('a counterexample satisfies all premises while the alleged conclusion is false',()=>{
  const witnesses=[];for(let mask=0;mask<8;mask++){const v={sun:!!(mask&1),rune:!!(mask&2),door:!!(mask&4)};if(Object.values(counterResult(v)).every(Boolean))witnesses.push(v);}assert.deepEqual(witnesses,[{sun:false,rune:false,door:true}]);
});
test('invalid pairs do not derive facts and restored history must be reachable',()=>{
  let s=createProof();s=apply(s,'sunRune','runeDoor');assert.equal(s.history.length,0);const saved={selected:'counter',history:[['sun','sunRune'],['rune','runeDoor']],selectedFacts:[],counter:{sun:false,rune:false,door:true,checked:true}};assert.equal(proofComplete(restoreProof(saved)),true);
  assert.throws(()=>restoreProof({...saved,history:[['sunRune','runeDoor']]}),RangeError);assert.equal(proofComplete(createProofSet()),false);
});
