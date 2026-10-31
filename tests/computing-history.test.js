import test from 'node:test';
import assert from 'node:assert/strict';
import {historyRecords,historySequence,createHistoryQuest,historyPlace,historyQuestComplete,restoreHistoryQuest} from '../src/computing-history.js';
test('wrong placement is reversible and the correct order follows the sourced years',()=>{let s=createHistoryQuest();s=historyPlace(s,'web');assert.equal(s.order.length,0);assert.equal(s.lastWrong,'web');for(const id of historySequence)s=historyPlace(s,id);assert.deepEqual(s.order.map(id=>historyRecords[id].year),[1843,1945,1989]);s.answer='collaboration';s.checked=true;assert.equal(historyQuestComplete(s),true);assert.deepEqual(restoreHistoryQuest(s),s);});
test('malformed order and incomplete reflection do not pass',()=>{const s=createHistoryQuest();assert.throws(()=>restoreHistoryQuest({...s,order:['web']}));assert.equal(historyQuestComplete({...s,answer:'collaboration',checked:true}),false);});
