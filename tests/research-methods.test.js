import test from 'node:test';
import assert from 'node:assert/strict';
import {researchMethods,researchCases,createResearch,researchCorrect,researchComplete,restoreResearch} from '../src/research-methods.js';
test('the three stated research questions distinguish methods while requiring checked choices',()=>{
 const s=createResearch();for(const [id,item] of Object.entries(researchCases)){for(const choice of Object.keys(researchMethods))assert.equal(researchCorrect(id,{choice,checked:true}),choice===item.answer);assert.equal(researchCorrect(id,{choice:item.answer,checked:false}),false);s[id]={choice:item.answer,checked:true};}assert.ok(researchComplete(s));assert.deepEqual(restoreResearch(s),s);
});
test('old drafts acquire uncompleted research and malformed choices are rejected',()=>{
 assert.equal(researchComplete(restoreResearch(undefined)),false);const s=createResearch();assert.throws(()=>restoreResearch({...s,context:{choice:'unknown',checked:true}}));
});
