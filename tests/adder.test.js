import test from 'node:test';
import assert from 'node:assert/strict';
import {fullAdder,testAdder,addFour,createAdder,restoreAdder,adderComplete} from '../src/adder.js';

const correct={p:'XOR',sum:'XOR',ab:'AND',pc:'AND',carry:'OR'};
const bits=n=>[3,2,1,0].map(shift=>(n>>shift)&1);
test('full adder implements all eight sums and detects a defective gate',()=>{
  assert.ok(testAdder(correct).every(row=>row.correct));
  for(const key of Object.keys(correct))assert.ok(testAdder({...correct,[key]:correct[key]==='AND'?'OR':'AND'}).some(row=>!row.correct));
  assert.throws(()=>fullAdder(correct,0,1,2),RangeError);
});
test('four cascaded adders agree with integer addition for all 256 inputs',()=>{
  for(let a=0;a<16;a++)for(let b=0;b<16;b++){
    const actual=addFour(correct,bits(a),bits(b));
    assert.equal(actual.values.unsigned,(a+b)%16);assert.equal(actual.carry,Math.floor((a+b)/16));
    assert.equal(actual.steps.length,4);
  }
  assert.equal(addFour(correct,bits(13),bits(2)).values.signed,-1);
});
test('saved circuit is validated, copied and checked again',()=>{
  const state=createAdder();state.parts={...correct};state.tested=true;
  const restored=restoreAdder(state);assert.equal(adderComplete(restored),true);state.parts.p='OR';assert.equal(restored.parts.p,'XOR');
  assert.equal(adderComplete({...restored,tested:false}),false);
  assert.throws(()=>restoreAdder({parts:{...correct,p:'INVALID'},tested:true}),RangeError);
});
