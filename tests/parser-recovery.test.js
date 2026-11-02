import {test} from 'node:test';
import assert from 'node:assert/strict';
import {recoveryActions,recoveryInitial,recoveryNext,recoveryExecute,recoveryReplay,recoveryCreate,recoveryStep,recoveryCheck,recoveryComplete,recoveryRestore} from '../src/parser-recovery.js';

for(const [id,accepted,discarded] of [['missingNumber',['火','風'],[]],['missingEnd',['火','土'],['風','＝','３']]])test(`${id}: resynchronization preserves only complete statements`,()=>{
 const s=recoveryInitial(id),history=[];while(recoveryNext(s)){const expected=recoveryNext(s);for(const wrong of Object.keys(recoveryActions).filter(x=>x!==expected))assert.throws(()=>recoveryExecute(structuredClone(s),wrong));recoveryExecute(s,expected);history.push(expected);assert.deepEqual(recoveryReplay(id,history),s);}assert.equal(s.done,true);assert.equal(s.errors,1);assert.deepEqual(s.accepted.map(x=>x.name),accepted);assert.deepEqual(s.discarded,discarded);assert.throws(()=>recoveryExecute(s,'match'));
});
test('both corrected outcomes and the recovery limitation are required',()=>{
 const q=recoveryCreate();for(const [id,answer] of [['missingNumber','fireWind'],['missingEnd','fireSoil']]){q.selected=id;while(true){const next=recoveryNext(recoveryReplay(id,q.trials[id].history));if(!next)break;recoveryStep(q,next);assert.deepEqual(recoveryRestore(q),q);}q.trials[id].guess='all';assert.equal(recoveryCheck(q),false);q.trials[id].guess=answer;assert.equal(recoveryCheck(q),true);}assert.equal(recoveryComplete(q),false);q.answer='loss';assert.equal(recoveryComplete(q),true);const bad=structuredClone(q);bad.trials.missingEnd.history=['finish'];assert.throws(()=>recoveryRestore(bad));
});
