import {test} from 'node:test';
import assert from 'node:assert/strict';
import {tapeCostSizes,tapeCostReplay,tapeCostCreate,tapeCostAdvance,tapeCostComplete,tapeCostRestore} from '../src/tape-complexity.js';

test('each unary tape visits its input, left blank and right blank while transitions count revisits',()=>{
 for(const n of tapeCostSizes){const q=tapeCostCreate();q.length=n;while(!tapeCostReplay(n,q.histories[n]).finished)tapeCostAdvance(q,1);const r=tapeCostReplay(n,q.histories[n]);assert.equal(r.time,2*n+2);assert.equal(r.space,n+2);assert.deepEqual(r.visited,Array.from({length:n+2},(_,i)=>i));assert.equal(r.state.marks.length,n+1);assert.equal(r.state.head,1);assert.throws(()=>tapeCostReplay(n,[...q.histories[n],'right']));}
});
test('all four tape lengths and the two interpretations are required, with validated replay',()=>{
 let q=tapeCostCreate();for(const n of tapeCostSizes){q.length=n;while(!tapeCostReplay(n,q.histories[n]).finished){tapeCostAdvance(q,4);q=tapeCostRestore(q);}}q.growth='linear';q.spaceAnswer='visits';assert.equal(tapeCostComplete(q),false);q.spaceAnswer='distinct';assert.equal(tapeCostComplete(q),true);const copy=tapeCostRestore(q);copy.histories[4].pop();assert.equal(tapeCostComplete(copy),false);assert.equal(tapeCostComplete(q),true);assert.throws(()=>tapeCostRestore({...q,histories:{...q.histories,2:['finish']}}));
});
