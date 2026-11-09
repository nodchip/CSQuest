import test from 'node:test';
import assert from 'node:assert/strict';
import {replaySorting} from '../src/endgame-sorting.js';
const insertUnsorted=['compare','swap','compare','swap','compare','keep'];
const insertEqual=['compare','keep','compare','swap','compare','swap'];
const selectUnsorted=['compare','compare','swap','compare','swap'];
const selectEqual=['compare','compare','swap','compare','keep'];
const insertSorted=['compare','keep','compare','keep'];
const selectSorted=['compare','compare','keep','compare','keep'];
test('insertion moves only strictly larger preceding cards',()=>{
 const p=replaySorting('insertion',[...insertUnsorted,...insertEqual]);assert.equal(p.done,true);assert.deepEqual(p.results.map(r=>r.order),[['1','2','3'],['1','2A','2B']]);assert.deepEqual(p.results.map(r=>r.comparisons),[3,3]);
 assert.equal(replaySorting('insertion',['swap']),null);assert.equal(replaySorting('insertion',['compare','keep']),null);
});
test('selection can reorder cards with equal values',()=>{
 const p=replaySorting('selection',[...selectUnsorted,...selectEqual]);assert.equal(p.done,true);assert.deepEqual(p.results.map(r=>r.order),[['1','2','3'],['1','2B','2A']]);assert.deepEqual(p.results.map(r=>r.comparisons),[3,3]);
 assert.equal(replaySorting('selection',['compare','swap']),null);
});
test('comparison counts concern value comparisons and depend on the given input',()=>{
 const p=replaySorting('compare',[...insertEqual,...selectEqual,...insertSorted,...selectSorted]);assert.equal(p.done,true);assert.deepEqual(p.results.map(r=>r.comparisons),[3,3,2,3]);
 assert.deepEqual(p.results.slice(0,2).map(r=>r.order),[['1','2A','2B'],['1','2B','2A']]);
});
