import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {similarityCases,similarityResult,similarityCreate,similarityInspect,similarityCheck,similarityComplete,similarityRestore} from '../src/similarity-review.js';

test('position matching and thresholds reveal both false signals and missed borrowings',()=>{
 assert.deepEqual(Object.fromEntries(Object.keys(similarityCases).map(id=>[id,similarityResult(id,2).count])),{quote:5,copy:3,paraphrase:0,common:5});
 assert.equal(similarityResult('quote',4).flagged,true);assert.equal(similarityResult('common',4).flagged,true);
 assert.equal(similarityResult('copy',2).flagged,true);assert.equal(similarityResult('copy',4).flagged,false);assert.equal(similarityResult('paraphrase',2).flagged,false);
 assert.throws(()=>similarityResult('missing',2));assert.throws(()=>similarityResult('quote',3));
});
test('observation, both thresholds, contextual review and process safeguards are required',()=>{
 const q=similarityCreate();q.choice='acceptable';assert.throws(()=>similarityCheck(q));
 for(const [id,c] of Object.entries(similarityCases)){q.scenario=id;for(const n of [2,4]){q.threshold=n;similarityInspect(q);}q.choice=c.answer;similarityCheck(q);}
 q.reflection='tradeoff';q.privacy='automatic';assert.equal(similarityComplete(q),false);q.privacy='review';assert.equal(similarityComplete(q),true);
 const copy=similarityRestore(q);copy.seen.pop();assert.equal(q.seen.length,8);
 assert.throws(()=>similarityRestore({...q,seen:[]}));assert.throws(()=>similarityRestore({...q,last:{...q.last,correct:false}}));
});
