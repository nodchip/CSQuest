import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewCases,reviewCreate,reviewRun,reviewCommentValid,reviewRestore,reviewDone} from '../src/peer-review.js';
test('ordinary examples pass but a boundary, authorization and failure case expose defects',()=>{
 for(let i=0;i<reviewCases.length;i++){assert.equal(reviewRun(i,'draft','normal').pass,true);assert.equal(reviewRun(i,'draft','edge').pass,false);for(const k of ['normal','edge'])assert.equal(reviewRun(i,'fixed',k).pass,true);assert.equal(reviewCommentValid(i,i===2?0:1,'issue'),true);assert.equal(reviewCommentValid(i,2,'issue'),false);}
});
test('review evidence, specific comment, recheck, and limits are needed; invalid drafts are rejected',()=>{
 const q=reviewCreate();for(let i=0;i<3;i++){q.cases[i]={draft:['normal','edge'],line:i===2?0:1,comment:'issue',accepted:true,fixed:['edge']};}q.reflection='limits';assert.equal(reviewDone(q),true);const copy=reviewRestore(q);copy.cases[0].draft.pop();assert.equal(q.cases[0].draft.length,2);q.cases[2].line=2;assert.throws(()=>reviewRestore(q));q.cases[2].accepted=false;q.cases[2].fixed=[];assert.equal(reviewDone(q),false);
});
