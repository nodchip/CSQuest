import test from 'node:test';
import assert from 'node:assert/strict';
import {nestedDictionaries,nestedCodes,decodeDictionary,dictionaryCorrect,createNestedDictionary,restoreNestedDictionary} from '../src/nested-dictionary.js';
import {createNosqlSet,restoreNosqlSet} from '../src/nosql-models.js';

test('both dictionary orders decode with their own corresponding codes',()=>{
 const correct=[];
 for(const dictionary of Object.keys(nestedDictionaries))for(const codes of Object.keys(nestedCodes))if(dictionaryCorrect(dictionary,codes))correct.push([dictionary,codes]);
 assert.deepEqual(correct,[['red','first'],['blue','reverse']]);
 assert.deepEqual(decodeDictionary('red','first'),[['赤','青'],['赤'],[],['赤','青']]);
 assert.throws(()=>decodeDictionary('red','missing'));
});
test('older drafts initialize dictionary selections and new ones restore',()=>{
 const q=createNosqlSet(),draft={selected:'kv',histories:{kv:[],document:[]},formats:q.formats,schema:q.schema,choices:q.choices,archive:q.archive,archivePrefix:q.archivePrefix,nested:q.nested};
 assert.deepEqual(restoreNosqlSet(draft).dictionary,createNestedDictionary());
 draft.dictionary={dictionary:'blue',codes:'reverse',checked:true};assert.deepEqual(restoreNosqlSet(draft).dictionary,draft.dictionary);
 assert.throws(()=>restoreNestedDictionary({dictionary:'blue',codes:null,checked:true}));
});
