import test from 'node:test';
import assert from 'node:assert/strict';
import {examples,unknowns,distance,compareExamples,chooseExample} from '../src/classification.js';

test('the closest example is determined by the sum of feature differences',()=>{
  assert.deepEqual(compareExamples(unknowns[0]).map(item=>item.distance),[1,2,4]);
  assert.deepEqual(compareExamples(unknowns[1]).map(item=>item.distance),[4,1,3]);
  assert.equal(chooseExample(unknowns[0],'A').correct,true);
  assert.equal(chooseExample(unknowns[1],'B').chosen.label,'赤の水晶');
  assert.equal(chooseExample(unknowns[0],'B').correct,false);
});
test('distance is symmetric and all tied closest examples are recognized',()=>{
  assert.equal(distance(examples[0],unknowns[0]),distance(unknowns[0],examples[0]));
  const compared=compareExamples({brightness:2,warmth:0},[{id:'p',brightness:1,warmth:0},{id:'q',brightness:3,warmth:0}]);
  assert.deepEqual(compared.map(item=>item.nearest),[true,true]);
  assert.throws(()=>chooseExample(unknowns[0],'Z'),RangeError);
});
