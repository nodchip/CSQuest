import test from 'node:test';
import assert from 'node:assert/strict';
import {divisionCases,divisionMembers,divisionExpected,divisionCaseCorrect,createDivision,restoreDivision,divisionComplete} from '../src/division.js';
test('universal requirements include extra marks and accept all candidates when empty',()=>{
 assert.deepEqual(divisionExpected('two'),['ao','kuro']);assert.deepEqual(divisionExpected('none'),['ao','beni','kuro','sora']);
 for(const mode of Object.keys(divisionCases)){let accepted=0;const ids=Object.keys(divisionMembers);for(let mask=0;mask<(1<<ids.length);mask++){const selected=ids.filter((_,i)=>mask&(1<<i));if(divisionCaseCorrect(mode,{selected,checked:true}))accepted++;}assert.equal(accepted,1);}
});
test('completion requires both scenarios, and restoration rejects invalid records',()=>{
 const s=createDivision();s.choices.two={selected:['kuro','ao'],checked:true};s.choices.none={selected:['ao','beni','kuro','sora'],checked:true};assert.equal(divisionComplete(s),true);const copy=restoreDivision(s);s.choices.none.selected.pop();assert.equal(divisionComplete(s),false);assert.equal(copy.choices.none.selected.length,4);copy.choices.two.selected=['ao','ao'];assert.throws(()=>restoreDivision(copy),RangeError);
});
