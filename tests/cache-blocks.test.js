import test from 'node:test';
import assert from 'node:assert/strict';
import {blockPatterns,blockSizes,createBlockTrial,blockAccess,createBlockSet,restoreBlocks,blocksComplete} from '../src/cache-blocks.js';

test('four traces match independently calculated hit counts and time',()=>{
  const expected={sequential:{1:[4,28],2:[6,18]},stride:{1:[4,28],2:[0,48]}};
  for(const id of Object.keys(blockPatterns))for(const size of blockSizes){let state=createBlockTrial(id,size);const lastUsed=new Map();let hits=0,time=0;
    for(const [i,page] of blockPatterns[id].requests.entries()){
      const block=Math.floor(page/size),hit=lastUsed.has(block);if(hit)hits++;else if(lastUsed.size===4/size){const victim=[...lastUsed].sort((a,b)=>a[1]-b[1])[0][0];lastUsed.delete(victim);}lastUsed.set(block,i);time+=1+(hit?0:5);
      const wrong=blockAccess(state,hit?'miss':'hit');assert.equal(wrong.index,state.index);state=blockAccess(state,hit?'hit':'miss');
    }
    assert.deepEqual([state.hits,state.total],expected[id][size]);assert.deepEqual([state.hits,state.total],[hits,time]);
  }
});
test('all four traces are required and indices reconstruct the cache safely',()=>{
  const set=createBlockSet();for(const id of Object.keys(blockPatterns))for(const size of blockSizes){let state=set.states[id][size];for(const page of blockPatterns[id].requests){const block=Math.floor(page/size)*size;state=blockAccess(state,state.cache.includes(block)?'hit':'miss');}set.states[id][size]=state;}assert.equal(blocksComplete(set),false);
  const saved={selected:'sequential',size:1,indices:{sequential:{1:8,2:8},stride:{1:8,2:8}}};assert.deepEqual(restoreBlocks(saved),set);set.average.answers={a:3.5,b:3.25,c:4.5};set.average.checked={a:true,b:true,c:true};set.average.comparison='b';set.average.confirmed=true;assert.equal(blocksComplete(set),true);assert.deepEqual(restoreBlocks({...saved,average:set.average}),set);assert.throws(()=>restoreBlocks({...saved,indices:{...saved.indices,stride:{1:9,2:8}}}),RangeError);
});
