import test from 'node:test';
import assert from 'node:assert/strict';
import {readBits,binaryCorrect,createBinary,restoreBinary,binaryComplete} from '../src/binary.js';

test('all 4-bit patterns represent the full unsigned and two-complement ranges',()=>{
  for(let n=0;n<16;n++){
    const bits=[3,2,1,0].map(shift=>(n>>shift)&1),value=readBits(bits);
    assert.equal(value.unsigned,n);assert.equal(value.signed,n<8?n:n-16);
  }
  assert.throws(()=>readBits([1,0,2,0]),RangeError);
});
test('each seal requires a checked correct pattern including signed overflow',()=>{
  const state=createBinary();
  state.bits.unsigned=[0,1,1,0];state.bits.negative=[1,1,0,1];state.bits.overflow=[1,0,0,0];
  assert.equal(binaryComplete(state),false);
  for(const id of Object.keys(state.checked))state.checked[id]=true;
  assert.equal(binaryComplete(state),true);
  assert.deepEqual(readBits(state.bits.overflow),{unsigned:8,signed:-8});
  state.bits.negative=[0,0,1,1];assert.equal(binaryCorrect('negative',state.bits.negative),false);assert.equal(binaryComplete(state),false);
});
test('restoration validates and copies each independent attempt',()=>{
  const saved=createBinary();saved.selected='negative';saved.bits.negative=[1,1,0,1];saved.checked.negative=true;
  const restored=restoreBinary(saved);saved.bits.negative[0]=0;assert.deepEqual(restored.bits.negative,[1,1,0,1]);
  assert.throws(()=>restoreBinary({...saved,selected:'other'}),RangeError);
  assert.throws(()=>restoreBinary({...saved,checked:{...saved.checked,overflow:'true'}}),RangeError);
});
