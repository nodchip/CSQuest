import test from 'node:test';import assert from 'node:assert/strict';import {replayScrollRetrieval} from '../src/endgame-scroll-retrieval.js';
const narrow=['toggle:a','toggle:c','check','precision:2/2','recall:2/3'];
const broad=['toggle:a','toggle:b','toggle:c','toggle:d','toggle:e','check','precision:3/5','recall:3/3'];
test('two searches give expected selected scrolls, precision and recall',()=>{
 assert.deepEqual(replayScrollRetrieval('narrow',narrow).results,[{mode:'narrow',hits:2,returned:2,total:3,selected:['a','c']}]);
 assert.deepEqual(replayScrollRetrieval('broad',broad).results,[{mode:'broad',hits:3,returned:5,total:3,selected:['a','b','c','d','e']}]);
});
test('wrong selection, denominators, premature or extra actions are rejected',()=>{
 for(const h of [['check'],['toggle:a','check'],['toggle:a','toggle:c','check','precision:2/3'],['toggle:a','toggle:c','check','precision:2/2','recall:2/2'],[...narrow,'check'],['toggle:z']])assert.equal(replayScrollRetrieval('narrow',h),null);
 assert.deepEqual(replayScrollRetrieval('narrow',['toggle:a','toggle:a']).selected,[]);
 const h=[...narrow,...broad];assert.equal(replayScrollRetrieval('compare',h).done,false);assert.equal(replayScrollRetrieval('compare',[...h,'answer:broad-recall']).done,true);assert.equal(replayScrollRetrieval('compare',[...h,'answer:broad-precision']),null);
});
