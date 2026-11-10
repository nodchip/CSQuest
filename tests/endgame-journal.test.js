import test from 'node:test';
import assert from 'node:assert/strict';
import {replayJournal} from '../src/endgame-journal.js';
const before=['set:0:before','set:1:before','check'],after=['set:0:after','set:1:after','check'];
test('uncommitted partial changes are restored to both before values',()=>{
 assert.deepEqual(replayJournal('undo',[]).disk,[3,2]);
 assert.equal(replayJournal('undo',['set:0:after','set:1:before','check']),null);
 const partial=['set:0:before'];assert.deepEqual(replayJournal('undo',JSON.parse(JSON.stringify(partial))).disk,[5,2]);
 assert.deepEqual(replayJournal('undo',[...partial,'reset']).disk,[3,2]);
 const result=replayJournal('undo',[...before,...before]);assert.equal(result.done,true);assert.deepEqual(result.results,[[5,2],[4,1]]);
});
test('committed changes are applied to both values even when only one was persisted',()=>{
 assert.deepEqual(replayJournal('redo',[]).disk,[5,2]);assert.equal(replayJournal('redo',['set:0:before','set:1:before','check']),null);
 const result=replayJournal('redo',[...after,...after]);assert.equal(result.done,true);assert.deepEqual(result.results,[[3,4],[3,2]]);assert.equal(replayJournal('redo',[...after,...after,'check']),null);
});
test('same stopped ledger has different correct outcomes depending on commit record',()=>{
 const p=replayJournal('decide',before);assert.deepEqual(p.results,[[6,1]]);assert.deepEqual(p.disk,[4,1]);
 assert.equal(replayJournal('decide',[...before,...before]),null);
 const result=replayJournal('decide',[...before,...after,...before]);assert.equal(result.done,true);assert.deepEqual(result.results,[[6,1],[4,3],[3,3]]);
});
