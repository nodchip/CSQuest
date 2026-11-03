import test from 'node:test';
import assert from 'node:assert/strict';
import {probabilityProfiles,possibilityProfiles,possibilityValues,possibilityKey,possibilityCreate,possibilityRestore,possibilityDone} from '../src/possibility-measures.js';
test('probability adds disjoint outcomes while possibility takes their maximum',()=>{
 assert.deepEqual(possibilityValues('first','narrow',2),{probability:3,possibility:7,necessity:0});
 assert.deepEqual(possibilityValues('first','narrow',4),{probability:2,possibility:2,necessity:0});
 assert.deepEqual(possibilityValues('first','narrow',6),{probability:5,possibility:7,necessity:0});
 assert.deepEqual(possibilityValues('first','narrow',1),{probability:5,possibility:10,necessity:3});
});
test('all event subsets obey the corresponding complement and union identities',()=>{
 for(const p of Object.keys(probabilityProfiles))for(const pi of Object.keys(possibilityProfiles))for(let a=0;a<8;a++)for(let b=0;b<8;b++){
  const x=possibilityValues(p,pi,a),y=possibilityValues(p,pi,b),u=possibilityValues(p,pi,a|b),complement=possibilityValues(p,pi,7^a);
  assert.equal(x.probability+complement.probability,10);assert.equal(x.necessity,10-complement.possibility);assert.equal(u.possibility,Math.max(x.possibility,y.possibility));if(!(a&b))assert.equal(u.probability,x.probability+y.probability);
 }
});
test('completion and stored observations are checked and copied',()=>{
 const q=possibilityCreate();q.seen=['first:narrow:0','first:narrow:1','first:narrow:2','first:narrow:4','first:narrow:6','first:narrow:7','first:wide:2','second:narrow:2'];q.interpretation='different';q.necessityAnswer='complement';assert.equal(possibilityDone(q),true);
 const copy=possibilityRestore(q);copy.seen.pop();assert.equal(q.seen.length,8);assert.equal(possibilityDone(copy),false);assert.throws(()=>possibilityRestore({...q,seen:[possibilityKey('first','narrow',0),'first:narrow:00']}));
});
