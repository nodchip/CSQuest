import test from 'node:test';
import assert from 'node:assert/strict';
import {readingCases,readingResult,createReading,readingComplete,restoreReading} from '../src/read-stone-procedure.js';
import {createCounting,restoreCounting} from '../src/counting-loop.js';

test('the displayed procedure adds even values including zero and negative numbers',()=>{
 assert.deepEqual(Object.keys(readingCases).map(readingResult),[6,-2,0,0]);
 const s=createReading();s.answers={mixed:6,negative:-2,empty:0,odd:0};s.checked={mixed:true,negative:true,empty:true,odd:true};s.meaning='count';s.finished=true;
 assert.equal(readingComplete(s),false);s.meaning='evenSum';assert.equal(readingComplete(s),true);
 const copy=restoreReading(s);copy.answers.negative=0;assert.equal(readingComplete(copy),false);assert.equal(s.answers.negative,-2);
 assert.throws(()=>restoreReading({...s,answers:{...s.answers,mixed:99}}));
});
test('old counting drafts keep their configuration and acquire an unanswered reading exercise',()=>{
 const {reading,...old}=createCounting();old.config.condition='positive';
 const r=restoreCounting(old);assert.equal(r.config.condition,'positive');assert.deepEqual(r.reading,createReading());
});
