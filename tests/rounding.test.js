import test from 'node:test';
import assert from 'node:assert/strict';
import {roundingValues,roundSmall,roundingCases,calculateRounding,createRounding,restoreRounding,roundingComplete} from '../src/rounding.js';
test('every representable value is exact and every adjacent midpoint selects the even significand',()=>{
  for(const [i,item] of roundingValues.entries()){assert.equal(roundSmall(item.value).value,item.value);if(!i)continue;const before=roundingValues[i-1],mid=(item.value+before.value)/2,result=roundSmall(mid);assert.equal(result.tie,true);assert.notEqual(item.even,before.even);assert.equal(result.value,item.even?item.value:before.value);}
  assert.throws(()=>roundSmall(-1),RangeError);
});
test('ties and two evaluation orders yield the expected rounded values',()=>{
  assert.equal(calculateRounding('even').first.value,1);assert.equal(calculateRounding('odd').first.value,1.25);assert.equal(calculateRounding('left').second.value,1);assert.equal(calculateRounding('right').second.value,1.125);
});
test('restoration validates answers and completion requires all checked correct trials',()=>{
  const s=createRounding();for(const id of Object.keys(roundingCases)){const r=calculateRounding(id);s.choices[id]={first:r.first.value,second:r.second?.value??null,checked:true};}assert.equal(roundingComplete(restoreRounding(s)),true);s.choices.right.second=1;assert.equal(roundingComplete(s),false);assert.throws(()=>restoreRounding({...s,choices:{...s.choices,even:{first:9,second:null,checked:true}}}),RangeError);
});
