import test from 'node:test';
import assert from 'node:assert/strict';
import {clockCases,clockLocal,clockMatches,clockCorrect,clockCreate,clockInspect,clockComplete,clockRestore} from '../src/clock-transition.js';

test('fixed historical transitions display expected local times and offsets',()=>{
 const expected={fall:[['01:30',-240],['01:30',-300],['02:30',-300]],spring:[['01:30',-300],['03:30',-240],['04:30',-240]],tokyo:[['00:30',540],['01:30',540],['02:30',540]]};
 for(const [id,c] of Object.entries(clockCases))for(const [i,t] of c.candidates.entries()){const {values,offsetMinutes}=clockLocal(c.zone,t);assert.equal(`${values.year}-${values.month}-${values.day}`,id==='spring'?'2024-03-10':'2024-11-03');assert.deepEqual([`${values.hour}:${values.minute}`,offsetMinutes],expected[id][i]);}
 assert.deepEqual(clockMatches('fall'),clockCases.fall.candidates.slice(0,2));assert.deepEqual(clockMatches('spring'),[]);assert.deepEqual(clockMatches('tokyo'),[clockCases.tokyo.candidates[1]]);
});
test('all candidate selections, saved progress and completion are checked',()=>{
 const answers={fall:[0,1],spring:[],tokyo:[1]};
 for(const [id,c] of Object.entries(clockCases))for(let mask=0;mask<8;mask++){const selected=c.candidates.filter((_,i)=>mask&(1<<i));assert.equal(clockCorrect(id,selected),selected.length===answers[id].length&&answers[id].every(i=>selected.includes(c.candidates[i])));}
 const q=clockCreate();clockInspect(q);assert.equal(q.last.correct,false);q.selected=clockCases.fall.candidates.slice(0,2).reverse();clockInspect(q);q.scenario='spring';q.selected=[];clockInspect(q);q.scenario='tokyo';q.selected=[clockCases.tokyo.candidates[1]];clockInspect(q);assert.equal(clockComplete(q),false);q.reflection='instant';assert.equal(clockComplete(q),true);assert.deepEqual(clockRestore(JSON.parse(JSON.stringify(q))),q);
 assert.throws(()=>clockRestore({...q,selected:[q.selected[0],q.selected[0]]}),RangeError);assert.throws(()=>clockRestore({...q,completed:['fall','fall']}),RangeError);assert.throws(()=>clockRestore({...q,last:{scenario:'spring',selected:[],correct:false}}),RangeError);
});
