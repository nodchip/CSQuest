import test from 'node:test';
import assert from 'node:assert/strict';
import {nestedOffsets,nestedValidity,nestedDecode,createNestedOffsets,restoreNestedOffsets} from '../src/nested-offsets.js';
import {createNosqlSet,restoreNosqlSet} from '../src/nosql-models.js';

test('only one pair of boundaries and validity marks reconstructs all four bags',()=>{
 const target=[['赤','青'],[],null,['緑']],matches=[];
 for(const o of Object.keys(nestedOffsets))for(const v of Object.keys(nestedValidity)){
  if(JSON.stringify(nestedDecode(o,v))===JSON.stringify(target))matches.push([o,v]);
 }
 assert.deepEqual(matches,[['correct','correct']]);
 assert.deepEqual(nestedDecode('correct','all'),[['赤','青'],[],[],['緑']]);
 assert.throws(()=>nestedDecode('missing','correct'));
});
test('old drafts restore without a choice and new choices are copied and checked',()=>{
 const q=createNosqlSet(),old={selected:'kv',histories:{kv:[],document:[]},formats:q.formats,schema:q.schema,choices:q.choices,archive:q.archive,archivePrefix:q.archivePrefix};
 assert.deepEqual(restoreNosqlSet(old).nested,createNestedOffsets());
 old.nested={offset:'correct',valid:'correct',checked:true};const restored=restoreNosqlSet(old);assert.deepEqual(restored.nested,old.nested);restored.nested.checked=false;assert.equal(old.nested.checked,true);
 assert.throws(()=>restoreNestedOffsets({offset:null,valid:'correct',checked:true}));
});
