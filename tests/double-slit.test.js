import test from 'node:test';
import assert from 'node:assert/strict';
import {slitModes,slitDistribution,slitCreate,slitCheck,slitDone,slitRestore} from '../src/double-slit.js';
test('interference and perfect path marking produce normalized four-bin distributions',()=>{
 assert.deepEqual(slitDistribution('plain'),[0,.5,.5,0]);
 assert.deepEqual(slitDistribution('phase'),[.5,0,0,.5]);
 assert.deepEqual(slitDistribution('marked'),[.25,.25,.25,.25]);
 for(const mode of Object.keys(slitModes))assert.equal(slitDistribution(mode).reduce((a,b)=>a+b,0),1);
 assert.throws(()=>slitDistribution('other'),RangeError);
});
test('wrong guesses do not count; all conditions and reflection survive restoration',()=>{
 const q=slitCreate();q.answer='outer';assert.equal(slitCheck(q),false);assert.deepEqual(q.seen,[]);
 for(const [mode,answer] of [['plain','middle'],['phase','outer'],['marked','equal']]){q.mode=mode;q.answer=answer;assert.equal(slitCheck(q),true);}
 assert.equal(slitDone(q),false);q.reflection='probability';assert.equal(slitDone(slitRestore(q)),true);
 const restored=slitRestore(q);restored.seen.pop();assert.equal(q.seen.length,3);
 assert.throws(()=>slitRestore({...q,seen:['plain','plain']}),RangeError);
});
