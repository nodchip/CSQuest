import test from 'node:test';
import assert from 'node:assert/strict';
import {extractionCases,extractionChoices,extractionCreate,extractionResult,extractionSet,extractionCheck,extractionDone,extractionRestore} from '../src/information-extraction.js';
test('each of 36 candidate records is compared field-by-field with its source message',()=>{
 const expected={done:['mira','port','done'],negated:['mira','port','negated'],planned:['nono','tower','planned']};
 for(const id of Object.keys(extractionCases))for(const actor of Object.keys(extractionChoices.actor))for(const place of Object.keys(extractionChoices.place))for(const status of Object.keys(extractionChoices.status)){
  const actual=extractionResult(id,{actor,place,status}),vals=[actor,place,status];assert.deepEqual(actual,['actor','place','status'].filter((_,i)=>vals[i]!==expected[id][i]));
 }
 assert.throws(()=>extractionResult('constructor',{actor:'mira',place:'port',status:'done'}));
});
test('each message must be correctly checked and the reflection must distinguish context',()=>{
 let q=extractionCreate();assert.equal(extractionCheck(q),null);
 for(const [id,choice] of Object.entries({done:['mira','port','done'],negated:['mira','port','negated'],planned:['nono','tower','planned']})){
  q.case=id;for(const [i,k] of ['actor','place','status'].entries())extractionSet(q,k,choice[i]);assert.deepEqual(extractionCheck(q),[]);q=extractionRestore(q);
 }
 assert.equal(extractionDone(q),false);q.reflection='names';assert.equal(extractionDone(q),false);q.reflection='context';assert.equal(extractionDone(q),true);
 extractionSet(q,'status','done');assert.equal(q.runs.planned.checked,false);assert.equal(extractionDone(q),false);assert.deepEqual(extractionCheck(q),['status']);
});
test('restoration rejects false checked states and copies records',()=>{
 const q=extractionCreate();q.runs.done={actor:'mira',place:'port',status:'negated',checked:true};assert.throws(()=>extractionRestore(q));
 q.runs.done={actor:'mira',place:'port',status:'done',checked:true};const restored=extractionRestore(q);restored.runs.done.actor='nono';assert.equal(q.runs.done.actor,'mira');
 q.runs.done.actor='constructor';assert.throws(()=>extractionRestore(q));
});
