import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCompleted,mergeCompleted} from '../src/progress-record.js';
import {completionRevisionToken,completionStatus,completionLabel,markCurrentCompletion} from '../src/completion-revisions.js';

test('earlier completion remains recorded but expanded activities stay unverified until confirmed',()=>{
 const id='forge-election-overlap',legacy=[id],token=completionRevisionToken(id);
 assert.equal(completionStatus(id,[],[]),'uncompleted');assert.equal(completionStatus(id,legacy,[]),'unverified');assert.match(completionLabel(id,legacy,[]),/追加条件は未確認/);
 const extra=markCurrentCompletion(id,[]);assert.deepEqual(extra,[token]);assert.equal(completionStatus(id,legacy,extra),'current');assert.equal(completionStatus(id,[],extra),'uncompleted');assert.deepEqual(markCurrentCompletion(id,extra),extra);
 assert.equal(completionStatus('ordinary',['ordinary'],[]),'current');assert.deepEqual(markCurrentCompletion('ordinary',['future']),['future']);
 assert.equal(completionStatus('workshop-interrupt-priority',['workshop-interrupt-priority'],[]),'unverified');
});
test('markers survive old-format parsing, unknown records and cross-tab union',()=>{
 const id='archive-search-tradeoffs',token=completionRevisionToken(id),known=[id,'ordinary'];
 const oldTab=parseCompleted(JSON.stringify([id,'future']),known),newTab=parseCompleted(JSON.stringify(['ordinary',token]),known);
 const merged=mergeCompleted(oldTab,newTab);assert.deepEqual(merged.completed,[id,'ordinary']);assert.deepEqual(merged.unknown,['future',token]);
 assert.equal(completionStatus(id,merged.completed,merged.unknown),'current');
 assert.deepEqual(parseCompleted(JSON.stringify([...merged.completed,...merged.unknown]),known),merged);
});
