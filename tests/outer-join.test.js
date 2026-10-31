import test from 'node:test';
import assert from 'node:assert/strict';
import {joinPairs,expectedPairs,joinCompleteCase,createOuterJoin,restoreOuterJoin,outerJoinComplete} from '../src/outer-join.js';
test('inner and left outer joins include two matches and preserve only the unmatched left row',()=>{
 assert.deepEqual(expectedPairs('inner'),['moon:a','moon:b']);assert.deepEqual(expectedPairs('left'),['moon:a','moon:b','star:none']);assert.throws(()=>expectedPairs('right'),RangeError);
 for(const mode of ['inner','left']){let accepted=0;for(let mask=0;mask<(1<<joinPairs.length);mask++){const selected=joinPairs.filter((_,i)=>mask&(1<<i));if(joinCompleteCase(mode,{selected,checked:true}))accepted++;}assert.equal(accepted,1);}
});
test('both correctly checked sets are needed and saved selections are validated and copied',()=>{
 const s=createOuterJoin();s.choices.inner={selected:['moon:b','moon:a'],checked:true};s.choices.left={selected:['moon:a','star:none','moon:b'],checked:true};assert.equal(outerJoinComplete(s),true);const saved=restoreOuterJoin(s);s.choices.left.selected.pop();assert.equal(outerJoinComplete(s),false);assert.equal(saved.choices.left.selected.length,3);saved.choices.left.selected=['star:none','star:none'];assert.throws(()=>restoreOuterJoin(saved),RangeError);
});
