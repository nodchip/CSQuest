import test from 'node:test';
import assert from 'node:assert/strict';
import {expansionReplay,validExpansionDrafts,shipments,destinations} from '../src/adventure-expansion.js';

test('breadth first search follows FIFO and returns minimum edge path',()=>{
 const s=expansionReplay('search-bfs',['s','a','b','t']);
 assert.deepEqual(s.path,['s','a','t']);assert.equal(s.distance.t,2);assert.equal(s.done,true);
 assert.throws(()=>expansionReplay('search-bfs',['s','b']));
 assert.equal(expansionReplay('search-bfs',['s','a','b']).done,false);
});
test('weighted search selects the smallest tentative distance and improves the goal',()=>{
 const before=expansionReplay('search-weighted',['s','a','b']);assert.equal(before.distance.t,11);assert.equal(before.distance.c,4);
 const after=expansionReplay('search-weighted',['s','a','b','c']);assert.equal(after.distance.t,6);
 const done=expansionReplay('search-weighted',['s','a','b','c','t']);assert.deepEqual(done.path,['s','b','c','t']);assert.equal(done.done,true);
 assert.throws(()=>expansionReplay('search-weighted',['s','b']));assert.throws(()=>expansionReplay('search-weighted',['s','a','t']));
});
test('comparison and data tasks require the conditions stated to players',()=>{
 assert.equal(expansionReplay('search-compare',['hops','time']).done,true);assert.throws(()=>expansionReplay('search-compare',['time']));
 assert.equal(expansionReplay('data-record',['swap:0','swap:1','find:10']).done,true);assert.throws(()=>expansionReplay('data-record',['find:10']));assert.throws(()=>expansionReplay('data-record',['find:30']));
 assert.equal(expansionReplay('data-filter',['pick:A','check']).done,false);
 assert.equal(expansionReplay('data-filter',['pick:A','check','pick:D','check']).done,true);
 assert.equal(expansionReplay('data-filter',['pick:A','pick:C','pick:D','check']).done,false);
 const h=['A:10','B:20','C:10','D:10'];assert.equal(expansionReplay('data-join',h).done,true);
 for(const row of shipments)assert.equal(destinations.find(d=>d.id===row.dest)?.id,row.dest);
 assert.throws(()=>expansionReplay('data-join',['A:30']));assert.throws(()=>expansionReplay('data-join',['A:10','A:10']));
});
test('saved work restores partial steps and rejects invalid or fabricated records',()=>{
 assert.equal(validExpansionDrafts({'search-bfs':['s','a'],'data-join':['A:10']}),true);
 assert.equal(validExpansionDrafts({'search-bfs':['s','b']}),false);
 assert.equal(validExpansionDrafts({'data-join':['A:30']}),false);
 assert.equal(validExpansionDrafts({'x':[]}),false);assert.equal(validExpansionDrafts([]),false);
});
