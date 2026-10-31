import test from 'node:test';
import assert from 'node:assert/strict';
import {createInclusive,toggleImprovement,testVisitor,visitorPass,inclusiveComplete,restoreInclusive} from '../src/inclusive.js';

test('each visitor exposes a distinct issue and all three improvements and checks are needed',()=>{
  let s=createInclusive();for(const id of ['color','keys','reader']){s=testVisitor(s,id);assert.equal(visitorPass(s,id),false);}assert.equal(inclusiveComplete(s),false);
  for(const key of ['text','keyboard','label'])s=toggleImprovement(s,key);
  assert.equal(inclusiveComplete(s),false);
  for(const id of ['color','keys','reader']){s=testVisitor(s,id);assert.equal(visitorPass(s,id),true);}assert.equal(inclusiveComplete(s),true);
});
test('changing a design invalidates prior checks and restored checks match current settings',()=>{
  let s=createInclusive();s=toggleImprovement(s,'text');s=testVisitor(s,'color');s=restoreInclusive(s);assert.equal(visitorPass(s,'color'),true);
  s=testVisitor(s,'keys');s=testVisitor(s,'color');assert.equal(restoreInclusive(s).last,'color');
  s=toggleImprovement(s,'keyboard');assert.deepEqual(s.tested,[]);assert.equal(s.last,null);
  assert.throws(()=>restoreInclusive({config:{text:true,keyboard:false,label:false},tested:['color','color'],last:'color'}),RangeError);
  assert.throws(()=>restoreInclusive({config:{text:1,keyboard:false,label:false},tested:[],last:null}),RangeError);
  assert.throws(()=>testVisitor(s,'unknown'),RangeError);
});
