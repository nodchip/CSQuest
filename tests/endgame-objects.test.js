import test from 'node:test';
import assert from 'node:assert/strict';
import {replayObjects} from '../src/endgame-objects.js';

test('instances keep separate state for two initial configurations',()=>{
 const p=replayObjects('identity',['act:A:charge']);assert.deepEqual(p.values,[2,2]);
 assert.equal(replayObjects('identity',['act:B:use','check']),null);
 assert.equal(replayObjects('identity',['act:B:use','act:B:charge','act:A:charge','check']),null);
 assert.equal(replayObjects('identity',['act:A:charge','check','act:A:use','check']).done,true);
});
test('public operations reject underflow, overflow and direct mutation',()=>{
 let p=replayObjects('encapsulation',['act:A:direct','act:A:use']);assert.deepEqual(p.values,[0,1]);
 assert.equal(replayObjects('encapsulation',['act:A:use','check']),null);
 p=replayObjects('encapsulation',['act:A:direct','act:A:use','check','act:A:direct','act:A:charge','check']);assert.equal(p.done,true);
});
test('a failure on one instance does not alter the other and reset restores both',()=>{
 const h=['act:B:use','act:A:use','act:B:charge'];let p=replayObjects('interaction',h);assert.deepEqual(p.values,[0,1]);
 p=replayObjects('interaction',[...h,'reset']);assert.deepEqual(p.values,[1,0]);assert.deepEqual(p.events,[]);
 assert.equal(replayObjects('interaction',[...h,'check','act:A:use','act:B:charge','check']).done,true);
});
