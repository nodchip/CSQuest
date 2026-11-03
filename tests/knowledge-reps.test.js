import test from 'node:test';
import assert from 'node:assert/strict';
import {knowledgeTypes,knowledgeEvaluate,knowledgeReps,knowledgeContexts,knowledgeCreate,knowledgeRestore,knowledgeDone} from '../src/knowledge-reps.js';
test('hierarchy, defaults, explicit facts and conditional rules differ as specified',()=>{
 assert.deepEqual(knowledgeTypes('shadeHerb'),['shadeHerb','herb','plant']);
 const expected={network:{unknown:[],cave:[],override:['日なた']},frame:{unknown:['日陰'],cave:['日陰'],override:['日なた']},rules:{unknown:[],cave:['日陰'],override:['日なた','日陰']}};
 for(const [representation,cases] of Object.entries(expected))for(const [context,values] of Object.entries(cases)){const r=knowledgeEvaluate(representation,context);assert.deepEqual(r.values,values);assert.equal(r.conflict,values.length===2);assert.deepEqual(r.types,['shadeHerb','herb','plant']);}
});
test('all comparisons and both reflections are needed; restored observations are validated',()=>{
 const q=knowledgeCreate();q.seen=Object.keys(knowledgeReps).flatMap(r=>Object.keys(knowledgeContexts).map(c=>`${r}:${c}`));q.difference='assumptions';q.conflictAnswer='policy';assert.equal(knowledgeDone(q),true);
 const c=knowledgeRestore(q);c.seen.pop();assert.equal(q.seen.length,9);assert.equal(knowledgeDone(c),false);assert.throws(()=>knowledgeRestore({...q,seen:['network:cave','network:cave']}));assert.throws(()=>knowledgeEvaluate('__proto__','unknown'));
});
