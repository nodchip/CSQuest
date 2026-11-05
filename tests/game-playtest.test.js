import test from 'node:test';
import assert from 'node:assert/strict';
import {playtestCreate,playtestResult,playtestRun,playtestDone,playtestRestore} from '../src/game-playtest.js';
import {createCaptions,restoreCaptions} from '../src/game-captions.js';

test('both fictional participants encounter barriers before the stated changes',()=>{
 for(const person of ['cue','control']){assert.equal(playtestResult(person,'initial'),false);assert.equal(playtestResult(person,'revised'),true);}assert.throws(()=>playtestResult('other','initial'));
});
test('both people and both trials are needed and old drafts remain readable',()=>{
 const q=playtestCreate();q.answer='repeat';for(const person of ['cue','control'])for(const version of ['initial','revised']){q.person=person;q.version=version;playtestRun(q);}assert(playtestDone(q));playtestRun(q);assert.equal(q.seen.length,4);const copy=playtestRestore(q);copy.seen.pop();assert.equal(q.seen.length,4);assert(!playtestDone(copy));assert.throws(()=>playtestRestore({...q,seen:['cue:unknown']}));const {playtest,...old}=createCaptions();assert.deepEqual(restoreCaptions(old),createCaptions());
});
