import test from 'node:test';
import assert from 'node:assert/strict';
import {archiveMatches,archiveCases,createArchiveAnswers,restoreArchiveAnswers} from '../src/object-archive.js';
import {createNosqlSet,restoreNosqlSet} from '../src/nosql-models.js';

test('prefix includes the slash, and full keys distinguish identical basenames',()=>{
 assert.deepEqual(archiveMatches('north/'),['north/map.png','north/report.txt']);
 assert.deepEqual(archiveMatches('north'),['north/map.png','north/report.txt','northwest/map.png']);
 assert.equal(archiveCases.north.answer,'two');assert.equal(archiveCases.identity.answer,'different');
});
test('answers survive a draft; older drafts start with no archive answers',()=>{
 const s=createNosqlSet(),draft={selected:'kv',histories:{kv:[],document:[]},formats:s.formats,schema:s.schema,choices:s.choices};
 assert.deepEqual(restoreNosqlSet(draft).archive,createArchiveAnswers());
 draft.archive={north:{choice:'two',checked:true},identity:{choice:'same',checked:true}};
 assert.deepEqual(restoreNosqlSet(draft).archive,draft.archive);
 assert.throws(()=>restoreArchiveAnswers({...draft.archive,north:{choice:'different',checked:true}}));
 assert.throws(()=>restoreArchiveAnswers({...draft.archive,identity:{choice:null,checked:true}}));
});
