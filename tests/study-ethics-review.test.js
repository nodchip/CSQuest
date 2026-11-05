import test from 'node:test';
import assert from 'node:assert/strict';
import {ethicsActions,ethicsStages,ethicsCreate,ethicsStep,ethicsRestore} from '../src/study-ethics-review.js';
import {createStudyDataCare,restoreStudyDataCare} from '../src/study-data-care.js';
test('only the next authorized step advances through the fictional review',()=>{let s=ethicsCreate();for(const stage of ethicsStages){for(const action of Object.keys(ethicsActions)){const n=ethicsStep(s,action);assert.equal(n.history.length,s.history.length+(action===stage.expected?1:0));if(action!==stage.expected)assert.ok(n.message);}s=ethicsStep(s,stage.expected);assert.deepEqual(ethicsRestore(s).history,s.history);}assert.equal(s.history.length,5);assert.throws(()=>ethicsRestore({history:['start']}));});
test('legacy data-care drafts migrate and review history is independently copied',()=>{const old=createStudyDataCare();delete old.ethicsLab;assert.deepEqual(restoreStudyDataCare(old).ethicsLab,ethicsCreate());const s=ethicsStep(ethicsCreate(),'prepare');const copy=ethicsRestore(s);copy.history.pop();assert.equal(s.history.length,1);});
