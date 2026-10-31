import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeCases,createMerge,chooseMerge,restoreMerge,mergeComplete} from '../src/merge-sort.js';
function run(id){let s=createMerge(id);while(!s.done){const a=s.runs[s.pair][s.left],b=s.runs[s.pair+1][s.right];s=chooseMerge(s,a.value<=b.value?'left':'right');}return s;}
test('both examples sort stably, preserving the original order of equal keys',()=>{
  for(const id of Object.keys(mergeCases)){const done=run(id),expected=mergeCases[id].items.slice().sort((a,b)=>a.value-b.value);assert.deepEqual(done.runs[0],expected);assert.ok(done.comparisons<=5);}
  assert.deepEqual(run('second').runs[0].map(item=>item.id),['B','D','A','C']);
});
test('all four-item inputs over three keys agree with an independent stable ordering',()=>{
  for(let code=0;code<81;code++){
    let digits=code;const items=['A','B','C','D'].map(id=>{const value=digits%3;digits=Math.floor(digits/3);return {id,value};});
    let state={...createMerge('first'),runs:items.map(item=>[{...item}])};
    while(!state.done){const a=state.runs[state.pair][state.left],b=state.runs[state.pair+1][state.right];state=chooseMerge(state,a.value<=b.value?'left':'right');}
    const expected=items.map((item,index)=>({...item,index})).sort((a,b)=>a.value-b.value||a.index-b.index).map(({id,value})=>({id,value}));
    assert.deepEqual(state.runs[0],expected);assert.ok(state.comparisons<=5);
  }
});
test('wrong comparisons and right-hand ties do not change progress',()=>{
  let s=createMerge('second');assert.equal(chooseMerge(s,'left').history.length,0);s=chooseMerge(s,'right');s=chooseMerge(s,'right');
  assert.equal(s.runs[s.pair][s.left].value,s.runs[s.pair+1][s.right].value);assert.equal(chooseMerge(s,'right').history.length,s.history.length);assert.match(chooseMerge(s,'right').message,/同じ値/);
});
test('restoration replays legal partial work and requires both results',()=>{
  const h={first:run('first').history,second:['right']};const value=restoreMerge({selected:'second',history:h});assert.equal(mergeComplete(value),false);
  assert.throws(()=>restoreMerge({selected:'first',history:{...h,second:['left']}}),RangeError);
  value.states.second=run('second');assert.equal(mergeComplete(value),true);
});
