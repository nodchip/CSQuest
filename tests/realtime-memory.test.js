import test from 'node:test';
import assert from 'node:assert/strict';
import {memoryCreate,memoryTrial,memoryStep,memoryTrialCorrect,memoryComplete,memoryRestore} from '../src/realtime-memory.js';

test('memory pressure evicts only unlocked pages in the fixed model and deadlines reflect fault delay',()=>{
 for(const [setup,cost,response,fault] of [[[],0,4,true],[['load'],3,4,true],[['load','lock'],3,1,false]]){
  const t=memoryTrial();assert.equal(memoryStep(t,'run'),false);for(const op of [...setup,'pressure','release','run'])assert.ok(memoryStep(t,op));assert.equal(t.preparation,cost);assert.equal(t.response,response);assert.equal(t.fault,fault);assert.equal(memoryStep(t,'run'),false);
 }
});
test('each distinct setup must be compared and saved histories are validated',()=>{
 const s=memoryCreate();for(const [m,ops] of [['demand',['pressure','release','run']],['preload',['load','pressure','release','run']],['locked',['load','lock','pressure','release','run']]]){for(const op of ops)assert.ok(memoryStep(s.trials[m],op));assert.ok(memoryTrialCorrect(s.trials[m],m));}
 assert.equal(memoryComplete(s),false);s.answer='limited';s.checked=true;assert.ok(memoryComplete(s));const saved=memoryRestore(s);saved.trials.locked.history.pop();assert.equal(s.trials.locked.history.length,5);assert.throws(()=>memoryRestore({...s,trials:{...s.trials,locked:{history:['lock']}}}));
 const misplaced=memoryCreate();for(const op of ['load','pressure','release','run'])memoryStep(misplaced.trials.demand,op);assert.equal(memoryTrialCorrect(misplaced.trials.demand,'demand'),false);
});
