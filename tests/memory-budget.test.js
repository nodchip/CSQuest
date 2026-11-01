import test from 'node:test';
import assert from 'node:assert/strict';
import {shelfSizes,shelfCases,shelfRun,bestShelves,createShelfQuest,restoreShelfQuest,shelfComplete} from '../src/memory-budget.js';
test('all configurations have correct price, misses, and modeled time',()=>{
 for(const id of Object.keys(shelfCases))for(const size of shelfSizes){const r=shelfRun(id,size),expected=id==='pair'?(size===1?6:2):(size===4?3:6);assert.equal(r.misses,expected);assert.equal(r.cost,4+2*size);assert.equal(r.time,6+5*expected);assert.equal(r.steps.length,6);}
 assert.deepEqual(Object.keys(shelfCases).map(id=>bestShelves(id)),[[2],[1],[4]]);
});
test('all comparisons and cheapest fastest affordable choice are required',()=>{
 const s=createShelfQuest();for(const id of Object.keys(shelfCases)){s.trials[id]={seen:[...shelfSizes],choice:bestShelves(id)[0],confirmed:true};}s.answer='tradeoff';s.checked=true;assert.equal(shelfComplete(s),true);s.trials.pair.choice=4;assert.equal(shelfComplete(s),false);s.trials.pair.choice=2;const r=restoreShelfQuest(s);r.trials.pair.seen.pop();assert.equal(s.trials.pair.seen.length,3);assert.equal(shelfComplete(r),false);assert.throws(()=>restoreShelfQuest({...s,size:3}));
});
