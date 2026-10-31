import test from 'node:test';
import assert from 'node:assert/strict';
import {tools,checkTypes,trySpells,restoreSpells} from '../src/types.js';

test('correctly connected tools process both input examples',()=>{
  const result=trySpells(['double','positive']);assert.equal(result.type.ok,true);
  assert.deepEqual(result.results.map(r=>r.trace),[[3,6,true],[-2,-4,false]]);
  assert.ok(result.results.every(r=>r.correct));
});
test('type checking catches incompatible tools before executing and also checks the final socket',()=>{
  assert.deepEqual(checkTypes(['invert','positive']),{ok:false,index:0,received:'number',required:'boolean'});
  assert.deepEqual(checkTypes(['double','double']),{ok:false,index:2,received:'number',required:'boolean'});
  assert.equal(trySpells(['invert','positive']).results,null);
});
test('a well-typed chain can produce the wrong intended result',()=>{
  const result=trySpells(['positive','invert']);assert.equal(result.type.ok,true);assert.ok(result.results.every(r=>!r.correct));
  assert.equal(restoreSpells({sequence:['positive','invert'],ran:true}).result.type.ok,true);
  assert.throws(()=>restoreSpells({sequence:['double','unknown'],ran:false}),RangeError);
  assert.throws(()=>restoreSpells({sequence:['double','positive'],ran:'true'}),RangeError);
  assert.equal(Object.keys(tools).length,4);
});
