import test from 'node:test';
import assert from 'node:assert/strict';
import {createRecursion,stepRecursion,restoreRecursion} from '../src/recursion.js';
function actions(n){return [...Array(n).fill('call'),'base',...Array(n).fill('return')];}
test('recursive calls reach the base and unwind to count arrangements',()=>{
  for(const [id,n,expected] of [['three',3,6],['four',4,24]]){const state=actions(n).reduce(stepRecursion,createRecursion(id));assert.equal(state.result,expected);assert.equal(state.status,'done');assert.equal(state.stack.length,0);}
});
test('premature returns and attempts to descend below zero do not change the stack',()=>{
  let s=createRecursion('three');assert.equal(stepRecursion(s,'return').log.length,0);s=['call','call','call'].reduce(stepRecursion,s);
  assert.equal(s.stack.at(-1).n,0);assert.equal(stepRecursion(s,'call').log.length,s.log.length);s=stepRecursion(s,'base');assert.equal(s.stack.at(-1).child,1);
});
test('restores partial calls and rejects impossible histories',()=>{
  const state=restoreRecursion({selected:'four',actions:{three:actions(3),four:['call','call']}});assert.equal(state.states.three.result,6);assert.equal(state.states.four.stack.at(-1).n,2);
  assert.throws(()=>restoreRecursion({selected:'three',actions:{three:['base'],four:[]}}),RangeError);
});
