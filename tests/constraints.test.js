import test from 'node:test';
import assert from 'node:assert/strict';
import {connections,colors,available,deadEnd,createConstraints,assignColor,undoColor,restoreConstraints,constraintsComplete} from '../src/constraints.js';

test('a locally legal red A empties the future fixed-red tower and can be undone',()=>{
  let state=assignColor(createConstraints(),'red');assert.deepEqual(available(state.assigned,'D'),[]);assert.equal(deadEnd(state.assigned),true);
  state=undoColor(state);assert.equal(state.backtracked,true);
  for(const color of ['blue','red','green','red'])state=assignColor(state,color);
  assert.equal(constraintsComplete(state),true);
});
test('all complete assignments agree with independent edge and domain constraints',()=>{
  const names=['A','B','C','D'],valid=[];
  for(const a of Object.keys(colors))for(const b of Object.keys(colors))for(const c of Object.keys(colors))for(const d of Object.keys(colors)){
    const input=[a,b,c,d],expected=d==='red'&&connections.every(([x,y])=>input[names.indexOf(x)]!==input[names.indexOf(y)]);
    let state=createConstraints(),accepted=true;try{for(const color of input){const next=assignColor(state,color);if(next.assigned.length===state.assigned.length){accepted=false;break;}state=next;}}catch{accepted=false;}
    assert.equal(accepted&&state.assigned.length===4,expected);if(expected)valid.push(input);
  }
  assert.deepEqual(valid,[['blue','red','green','red'],['green','red','blue','red']]);
});
test('restoration validates dead-end evidence and copies choices',()=>{
  const state=undoColor(assignColor(createConstraints(),'red'));state.assigned=['blue'];const restored=restoreConstraints(state);
  state.assigned[0]='red';assert.deepEqual(restored.assigned,['blue']);assert.equal(restored.backtracked,true);
  assert.throws(()=>restoreConstraints({assigned:[],witness:['blue'],backtracked:true}),RangeError);
  assert.throws(()=>restoreConstraints({assigned:['blue','blue'],witness:null,backtracked:false}),RangeError);
});
