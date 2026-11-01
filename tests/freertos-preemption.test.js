import test from 'node:test';
import assert from 'node:assert/strict';
import {freeRtosTrial,freeRtosStep,freeRtosCorrect,freeRtosCreate,freeRtosComplete,freeRtosRestore} from '../src/freertos-preemption.js';

test('unblocking preempts only with the setting or after voluntary yield',()=>{
 for(const [mode,expected,finish] of [['preempt','llhll',3],['cooperative','llllh',5],['yield','llhll',3]]){
  const t=freeRtosTrial();assert.equal(freeRtosStep(t,mode,'yield'),false);for(let i=0;i<2;i++)assert.ok(freeRtosStep(t,mode,'tick'));
  if(mode==='yield')assert.ok(freeRtosStep(t,mode,'yield'));for(let i=0;i<3;i++)assert.ok(freeRtosStep(t,mode,'tick'));
  assert.equal(t.steps.map(x=>x==='low'?'l':'h').join(''),expected);assert.equal(t.highFinished,finish);assert.ok(freeRtosCorrect(t,mode));assert.equal(freeRtosStep(t,mode,'tick'),false);
 }
});
test('all three comparisons and saved legal action histories are required',()=>{
 const s=freeRtosCreate();for(const mode of ['preempt','cooperative','yield']){const t=s.trials[mode];for(let i=0;i<5;i++){if(mode==='yield'&&i===2)assert.ok(freeRtosStep(t,mode,'yield'));assert.ok(freeRtosStep(t,mode,'tick'));}}
 assert.equal(freeRtosComplete(s),false);s.answer='setting';s.checked=true;assert.ok(freeRtosComplete(s));const restored=freeRtosRestore(s);restored.trials.yield.history.pop();assert.equal(s.trials.yield.history.length,6);assert.throws(()=>freeRtosRestore({...s,trials:{...s.trials,preempt:{history:['yield']}}}));
});
