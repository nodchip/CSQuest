import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeField,revisionCases,createRevision,revisionCorrect,restoreRevision,revisionComplete} from '../src/revision.js';
test('three-way merging respects unchanged, identical, and divergent edits',()=>{
  const values=['a','b','c'];for(const base of values)for(const ours of values)for(const theirs of values){const value=mergeField(base,ours,theirs);if(ours===theirs)assert.equal(value,ours);else if(ours===base)assert.equal(value,theirs);else if(theirs===base)assert.equal(value,ours);else assert.equal(value,null);}
  assert.equal(mergeField('red','blue','green'),null);assert.equal(mergeField('red','blue','blue'),'blue');
});
test('the requested resolution is distinct from recognizing the conflict',()=>{
  const s=createRevision();s.choices.conflict.signal='conflict';s.resolution='青';assert.equal(revisionCorrect('conflict',s),false);s.resolution='緑';assert.equal(revisionCorrect('conflict',s),true);
});
test('all examples require checked correct answers and saved choices are validated',()=>{
  const s=createRevision();for(const [id,task] of Object.entries(revisionCases)){for(const f of task.fields)s.choices[id][f.id]=mergeField(f.base,f.ours,f.theirs)??'conflict';s.checked[id]=true;}s.resolution='緑';assert.equal(revisionComplete(restoreRevision(s)),true);
  s.checked.same=false;assert.equal(revisionComplete(s),false);assert.throws(()=>restoreRevision({...s,resolution:'赤'}),RangeError);
});
