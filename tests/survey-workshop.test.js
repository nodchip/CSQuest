import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {surveyQuestions,surveyKinds,surveyResidents,surveyResult,surveyCreate,surveyCheck,surveyInspect,surveyComplete,surveyRestore} from '../src/survey-workshop.js';

test('invitation, nonresponse and recorded preferences use the correct denominators',()=>{
 assert.deepEqual(surveyResult('online'),{population:8,invited:4,notInvited:4,responded:3,nonresponse:1,board:3,crystal:0});
 assert.deepEqual(surveyResult('mixed'),{population:8,invited:8,notInvited:0,responded:6,nonresponse:2,board:3,crystal:3});
 assert.equal(surveyResidents.filter(x=>x.preference==='board').length,4);assert.equal(surveyResidents.filter(x=>x.preference==='crystal').length,4);
 assert.equal(surveyResult('online').responded/surveyResult('online').invited,surveyResult('mixed').responded/surveyResult('mixed').invited);
 assert.throws(()=>surveyResult('bad'));
});
test('all question classifications and both response comparisons are required',()=>{
 for(const [question,c] of Object.entries(surveyQuestions))for(const kind of Object.keys(surveyKinds)){const q=surveyCreate();q.question=question;q.choice=kind;surveyCheck(q);assert.equal(q.last.correct,kind===c.kind);assert.equal(q.checked.includes(question),kind===c.kind);}
 const q=surveyCreate();for(const [question,c] of Object.entries(surveyQuestions)){q.question=question;q.choice=c.kind;surveyCheck(q);}for(const mode of ['online','mixed']){q.mode=mode;surveyInspect(q);}q.conclusion='limits';q.privacy='publish';assert.equal(surveyComplete(q),false);q.privacy='minimize';assert.equal(surveyComplete(q),true);
 const copy=surveyRestore(q);copy.seen.pop();assert.equal(q.seen.length,2);assert.throws(()=>surveyRestore({...q,last:{...q.last,correct:false}}));
});
