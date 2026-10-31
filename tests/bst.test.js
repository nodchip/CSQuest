import test from 'node:test';
import assert from 'node:assert/strict';
import {bstCases,bstTarget,createBst,bstStep,restoreBst,bstComplete} from '../src/bst.js';
function play(id){let state=createBst(id);while(state.phase!=='done'){const target=state.phase==='insert'?bstCases[id].keys[state.index]:bstTarget;state=bstStep(state,target<state.current?'left':'right');}return state;}
test('both trees maintain the global search invariant and produce different search paths',()=>{
  for(const id of Object.keys(bstCases)){const state=play(id),walk=(key,lo,hi)=>{if(key===null)return [];assert.ok(key>lo&&key<hi);const node=state.nodes[key];return [...walk(node.left,lo,key),key,...walk(node.right,key,hi)];};assert.deepEqual(walk(state.root,-Infinity,Infinity),[1,2,3,4,5]);}
  assert.deepEqual(play('branch').visits,[3,4,5]);assert.deepEqual(play('chain').visits,[1,2,3,4,5]);
});
test('incorrect direction never changes a tree or advances history',()=>{
  for(const id of Object.keys(bstCases)){let state=createBst(id);while(state.phase!=='done'){const target=state.phase==='insert'?bstCases[id].keys[state.index]:bstTarget,side=target<state.current?'left':'right',wrong=bstStep(state,side==='left'?'right':'left');assert.deepEqual(wrong.nodes,state.nodes);assert.deepEqual(wrong.history,state.history);state=bstStep(state,side);}}
});
test('validated histories restore independently and completion requires both trees',()=>{
  const branch=play('branch'),chain=play('chain');const saved={selected:'chain',history:{branch:branch.history,chain:chain.history.slice(0,3)}};const value=restoreBst(saved);assert.equal(value.states.chain.phase,'insert');assert.equal(bstComplete(value),false);
  value.states.chain=chain;assert.equal(bstComplete(value),true);assert.throws(()=>restoreBst({...saved,history:{...saved.history,branch:['right']}}),RangeError);
});
