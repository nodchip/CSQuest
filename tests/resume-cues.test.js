import test from 'node:test';
import assert from 'node:assert/strict';
import {resumeSteps,resumeStages,resumeRequired,resumeCreate,resumeCheck,resumeComplete,resumeRestore} from '../src/resume-cues.js';

test('the next step follows the completed prefix in both fixed stages',()=>{
 assert.deepEqual(Object.keys(resumeSteps),['label','pack','seal']);
 for(const stage of Object.values(resumeStages)){assert.deepEqual(stage.done,Object.keys(resumeSteps).slice(0,stage.done.length));assert.equal(stage.next,Object.keys(resumeSteps)[stage.done.length]);}
});
test('all four scenarios need the right step; hidden progress requires inspection',()=>{
 const q=resumeCreate();q.answer='pack';assert.throws(()=>resumeCheck(q),RangeError);q.inspected=true;q.answer='seal';resumeCheck(q);assert.equal(q.last.correct,false);assert.deepEqual(q.checked,[]);
 for(const key of resumeRequired){[q.mode,q.stage]=key.split(':');q.inspected=q.mode==='hidden';q.answer=resumeStages[q.stage].next;resumeCheck(q);}
 assert.equal(resumeComplete(q),false);q.reflection='cue';assert.equal(resumeComplete(q),true);const copy=resumeRestore(q);copy.checked.pop();assert.equal(q.checked.length,4);assert.throws(()=>resumeRestore({...q,last:{...q.last,correct:false}}),RangeError);assert.throws(()=>resumeRestore({...q,checked:['hidden:first','hidden:first']}),RangeError);
});
