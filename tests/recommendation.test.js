import test from 'node:test';
import assert from 'node:assert/strict';
import {recommendationDistances,recommend,createRecommendation,recommendationComplete,restoreRecommendation} from '../src/recommendation.js';
test('common ratings determine distances and missing ratings are not zeros',()=>{
 assert.deepEqual(recommendationDistances('sun').map(r=>[r.overlap,r.distance]),[[2,0],[2,4],[2,1],[1,null]]);
 assert.deepEqual(recommendationDistances('moon').map(r=>[r.overlap,r.distance]),[[2,4],[2,0],[2,3],[1,null]]);
 assert.deepEqual(recommend('sun'),{neighbors:['aki','chika'],prediction:4.5});
 assert.deepEqual(recommend('moon'),{neighbors:['bela','chika'],prediction:2.5});
 assert.equal(recommend('newcomer'),null);assert.throws(()=>recommend('bad'));
});
test('completion and restored records require valid neighbors',()=>{
 const s=createRecommendation();s.choices.sun=['aki','chika'];s.choices.moon=['bela','chika'];s.done=['sun','moon','newcomer'];s.answer='limits';s.checked=true;
 assert.ok(recommendationComplete(s));assert.deepEqual(restoreRecommendation(s),s);
 assert.throws(()=>restoreRecommendation({...s,choices:{...s.choices,sun:['aki','dora']}}));
 assert.throws(()=>restoreRecommendation({...s,done:['sun','sun']}));
});
