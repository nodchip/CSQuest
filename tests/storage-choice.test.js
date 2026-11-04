import test from 'node:test';
import assert from 'node:assert/strict';
import {storageChoiceCases,createStorageChoices,restoreStorageChoices} from '../src/storage-choice.js';
import {createNosqlSet,restoreNosqlSet} from '../src/nosql-models.js';

test('the stated requirements distinguish a key lookup from a multi-record transaction',()=>{
  assert.equal(storageChoiceCases.lookup.answer,'key');
  assert.equal(storageChoiceCases.orders.answer,'relational');
  const s=createStorageChoices();s.lookup={choice:'relational',checked:true};
  assert.deepEqual(restoreStorageChoices(s),s);
  assert.throws(()=>restoreStorageChoices({...s,orders:{choice:null,checked:true}}));
});
test('old quest drafts restore without answers and new answers survive',()=>{
  const q=createNosqlSet(),old={selected:'kv',histories:{kv:[],document:[]},formats:q.formats,schema:q.schema};
  assert.deepEqual(restoreNosqlSet(old).choices,createStorageChoices());
  old.choices={lookup:{choice:'key',checked:true},orders:{choice:'relational',checked:false}};
  assert.deepEqual(restoreNosqlSet(old).choices,old.choices);
  assert.throws(()=>restoreNosqlSet({...old,choices:{...old.choices,lookup:{choice:'unknown',checked:true}}}));
});
