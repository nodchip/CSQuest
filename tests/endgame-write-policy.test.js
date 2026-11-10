import test from 'node:test';import assert from 'node:assert/strict';import {replayWritePolicy} from '../src/endgame-write-policy.js';
const through=['readA','write1','write2','before:2','readB','after:2','count:2','next'];
const back=['readA','write1','write2','before:0','readB','after:2','count:1','next'];
test('two updates give independently expected write-through and write-back states',()=>{
 const a=replayWritePolicy('through',through),b=replayWritePolicy('back',back);
 assert.deepEqual(a.results,[{mode:'through',before:2,after:2,writes:2}]);assert.deepEqual(b.results,[{mode:'back',before:0,after:2,writes:1}]);
 assert.equal(a.done,true);assert.equal(b.done,true);
});
test('wrong ordering, wrong observations and malformed histories are rejected',()=>{
 for(const [k,h] of [['through',['write1']],['back',['readA','write1','write2','before:2']],['through',['readA','write1','write2','before:2','readB','after:0']],['back',['next']],['through',[...through,'reset']],['through',['readA','write1','write2','before:2','readB','after:2','count:1']]])assert.equal(replayWritePolicy(k,h),null);
 assert.deepEqual(replayWritePolicy('back',['readA','reset']).state,replayWritePolicy('back',[]).state);
 const h=[...through,...back];assert.equal(replayWritePolicy('compare',h).done,false);assert.equal(replayWritePolicy('compare',[...h,'answer:coalesce']).done,true);assert.equal(replayWritePolicy('compare',[...h,'answer:never']),null);
});
