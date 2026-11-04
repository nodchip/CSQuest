import test from 'node:test';
import assert from 'node:assert/strict';
import {skipBlocks,skipIndexQuery,skipAfterUpdate,createSkipExercise,restoreSkipExercise} from '../src/document-skip-index.js';
import {createNosqlSet,restoreNosqlSet} from '../src/nosql-models.js';

test('skipping by maximum preserves every matching document for all thresholds',()=>{
 const docs=Object.values(skipBlocks).flat();
 for(let n=0;n<=10;n++){
  const r=skipIndexQuery(n),expected=docs.filter(d=>d.delivery.count>=n).map(d=>d.id);
  assert.deepEqual(r.matches,expected);assert.ok(expected.every(id=>r.candidates.includes(id)));
 }
 assert.deepEqual([3,5,7].map(n=>skipIndexQuery(n).skipped.length),[0,1,2]);
 assert.deepEqual(skipIndexQuery(7).candidates,['E','F']);assert.deepEqual(skipIndexQuery(7).matches,['F']);
});
test('outdated block maxima can exclude a newly matching document',()=>{
 const stale=skipAfterUpdate('stale'),fresh=skipAfterUpdate('fresh');
 assert.deepEqual(stale.actual,['B','F']);assert.deepEqual(stale.matches,['F']);
 assert.deepEqual(fresh.actual,['B','F']);assert.deepEqual(fresh.matches,['B','F']);
 assert.deepEqual(skipBlocks.first.map(d=>d.delivery.count),[1,3]);
 assert.throws(()=>skipAfterUpdate('other'));
});
test('older drafts initialize the activity and choices are safely restored',()=>{
 const q=createNosqlSet(),draft={selected:'kv',histories:{kv:[],document:[]},formats:q.formats,schema:q.schema,choices:q.choices,archive:q.archive,archivePrefix:q.archivePrefix,nested:q.nested,dictionary:q.dictionary,workload:q.workload,jsonPath:q.jsonPath};
 assert.deepEqual(restoreNosqlSet(draft).skip,createSkipExercise());
 draft.skip=createSkipExercise();draft.skip.threshold=7;draft.skip.answers[7]={guess:2,checked:true};
 assert.deepEqual(restoreNosqlSet(draft).skip,draft.skip);
 const earlier=structuredClone(draft.skip);delete earlier.maintenance;assert.deepEqual(restoreSkipExercise(earlier).maintenance,{mode:'stale',guess:null,checked:false});
 draft.skip.maintenance={mode:'fresh',guess:'found',checked:true};assert.deepEqual(restoreNosqlSet(draft).skip.maintenance,draft.skip.maintenance);
 assert.throws(()=>restoreSkipExercise({...draft.skip,maintenance:{mode:'fresh',guess:null,checked:true}}));
 assert.throws(()=>restoreSkipExercise({...draft.skip,threshold:4}));
 assert.throws(()=>restoreSkipExercise({...draft.skip,answers:{...draft.skip.answers,7:{guess:null,checked:true}}}));
});
