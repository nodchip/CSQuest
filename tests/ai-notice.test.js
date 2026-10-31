import test from 'node:test';
import assert from 'node:assert/strict';
import {createAiNotice,aiNoticeProblems,aiNoticeComplete,restoreAiNotice} from '../src/ai-notice.js';
test('review, factual correction, attribution and disclosure are required for this notice',()=>{const s=createAiNotice();assert.equal(aiNoticeProblems(s).length,5);Object.assign(s,{inspected:true,draft:'ai',source:true,disclosure:true,reviewed:true});assert.deepEqual(aiNoticeProblems(s),['元の知らせに合う本文を選ぶ']);s.draft='verified';s.published=true;s.answer='accountability';s.checked=true;assert.equal(aiNoticeComplete(s),true);assert.deepEqual(restoreAiNotice(s),s);});
test('rejects a publication or review that lacks necessary evidence',()=>{const s=createAiNotice();assert.throws(()=>restoreAiNotice({...s,published:true}));assert.throws(()=>restoreAiNotice({...s,reviewed:true}));});
