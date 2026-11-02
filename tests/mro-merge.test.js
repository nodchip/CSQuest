import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mroCases,mroInitial,mroNext,mroStep,mroReplay,mroCreate,mroTry,mroCheck,mroComplete,mroRestore} from '../src/mro-merge.js';

const expected={fire:['F','W','R','finish'],wind:['W','F','R','finish'],conflict:['X','Y','conflict']};
for(const id of Object.keys(mroCases))test(`${id}: ordered merge rejects every incorrect selection`,()=>{
 const s=mroInitial(id),history=[];for(const choice of expected[id]){assert.equal(mroNext(s),choice);for(const wrong of ['F','W','R','X','Y','finish','conflict'].filter(x=>x!==choice))assert.throws(()=>mroStep(structuredClone(s),wrong));mroStep(s,choice);history.push(choice);assert.deepEqual(mroReplay(id,history),s);}assert.equal(s.finished,true);assert.throws(()=>mroStep(s,'finish'));
});
test('all completed cases and reflection are required; saved progress is validated',()=>{
 const q=mroCreate();assert.equal(mroCheck(q),false);
 for(const [id,steps] of Object.entries(expected)){q.selected=id;for(const step of steps)mroTry(q,step);q.trials[id].prediction='conflict';if(id!=='conflict')assert.equal(mroCheck(q),false);q.trials[id].prediction=id==='conflict'?'conflict':id==='fire'?'F':'W';assert.equal(mroCheck(q),true);assert.deepEqual(mroRestore(q),q);}
 assert.equal(mroComplete(q),false);q.answer='order';assert.equal(mroComplete(q),true);const bad=structuredClone(q);bad.trials.fire.history=['W'];assert.throws(()=>mroRestore(bad));bad.trials.fire.history=[];assert.throws(()=>mroRestore(bad));
});
