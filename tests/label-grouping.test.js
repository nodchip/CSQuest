import {test} from 'node:test';
import assert from 'node:assert/strict';
import {groupingLayouts,groupingRelations,groupingCreate,groupingObserve,groupingComplete,groupingRestore} from '../src/label-grouping.js';

test('four layout and relationship combinations and a repaired board are needed',()=>{const q=groupingCreate();for(const layout of Object.keys(groupingLayouts))for(const relation of Object.keys(groupingRelations)){q.layout=layout;q.relation=relation;groupingObserve(q);groupingObserve(q);assert.deepEqual(groupingRestore(q),q);}assert.equal(q.seen.length,4);assert(!groupingComplete(q));q.layout='near';q.relation='linked';q.checked=true;q.answer='both';assert(groupingComplete(q));groupingObserve(q);assert(!groupingComplete(q));});
test('restore rejects duplicate observations and a falsely checked board',()=>{const q=groupingCreate();for(const bad of [{...q,seen:['near:linked','near:linked']},{...q,seen:['near:wrong']},{...q,checked:true},{...q,layout:'unknown'}])assert.throws(()=>groupingRestore(bad));});
