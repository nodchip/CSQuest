import {test} from 'node:test';
import assert from 'node:assert/strict';
import {batchModes,batchReplay,batchCreate,batchStep,batchComplete,batchRestore} from '../src/message-batching.js';

test('batch sizes trade first arrival against total time in a serial fixed-cost model',()=>{
 const expected={one:{actions:['1:4','1:4','1:4','1:4'],times:[4,8,12,16]},two:{actions:['2:5','2:5'],times:[5,10]},four:{actions:['4:7'],times:[7]}};
 for(const [mode,{actions,times}] of Object.entries(expected)){const h=[];for(const a of actions){assert.throws(()=>batchReplay(mode,[...h,'1:99']));h.push(a);const s=batchReplay(mode,h);assert.equal(s.time,times[h.length-1]);assert(s.sent<=4);}const s=batchReplay(mode,h);assert.deepEqual(s.arrivals.map(x=>x.time),times);assert.equal(s.sent,4);assert.equal(s.next,null);assert.throws(()=>batchReplay(mode,[...h,actions[0]]));}
});
test('all batch sizes, correct predictions, and reflection are required and restored',()=>{const q=batchCreate();for(const id of Object.keys(batchModes)){q.mode=id;const size=batchModes[id].size;for(let i=0;i<4/size;i++){batchStep(q,`${size}:${3+size}`);assert.deepEqual(batchRestore(q),q);}}assert(!batchComplete(q));q.answer='tradeoff';assert(batchComplete(q));const bad=structuredClone(q);bad.histories.two[0]='2:4';assert.throws(()=>batchRestore(bad));});
