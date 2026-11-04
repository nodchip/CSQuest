import test from 'node:test';
import assert from 'node:assert/strict';
import {jsonPathText,jsonPathExpected,createJsonPathCase,restoreJsonPathCase} from '../src/json-path-case.js';
import {createNosqlSet,restoreNosqlSet} from '../src/nosql-models.js';

test('fixed paths distinguish text values from an absent key',()=>{
 assert.equal(jsonPathText('village'),'北');assert.equal(jsonPathText('count'),'2');assert.equal(jsonPathText('missing'),null);
 assert.deepEqual(['village','count','missing'].map(jsonPathExpected),['north','two','missing']);
 assert.throws(()=>jsonPathText('unknown'));
});
test('old drafts gain the exercise and saved answers restore independently',()=>{
 const q=createNosqlSet(),draft={selected:'kv',histories:{kv:[],document:[]},formats:q.formats,schema:q.schema,choices:q.choices,archive:q.archive,archivePrefix:q.archivePrefix,nested:q.nested,dictionary:q.dictionary,workload:q.workload};
 assert.deepEqual(restoreNosqlSet(draft).jsonPath,createJsonPathCase());
 const value=createJsonPathCase();value.selected='missing';value.answers.missing={guess:'missing',checked:true};draft.jsonPath=value;
 const restored=restoreNosqlSet(draft);assert.deepEqual(restored.jsonPath,value);restored.jsonPath.answers.missing.checked=false;assert.equal(value.answers.missing.checked,true);
 assert.throws(()=>restoreJsonPathCase({...value,answers:{...value.answers,count:{guess:null,checked:true}}}));
});
