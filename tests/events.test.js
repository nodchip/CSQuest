import {createMvcLantern,stepMvcLantern} from '../src/mvc-lantern.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {eventCases,eventHandlers,createEventTrial,eventStep,eventTrialDone,eventTrialCorrect,createEventSet,restoreEvents,eventsComplete} from '../src/events.js';

function schedules(id,handlers){const outcomes=[];function visit(s){if(eventTrialDone(s)){outcomes.push(s);return;}if(s.sent<eventCases[id].events.length)visit(eventStep(s,'signal'));if(s.queue.length)visit(eventStep(s,'dispatch'));}visit(createEventTrial(id,handlers));return outcomes;}
test('all handler mappings and valid queue interleavings preserve FIFO results',()=>{
  for(const id of Object.keys(eventCases))for(const sun of Object.keys(eventHandlers))for(const moon of Object.keys(eventHandlers)){
    const expected=eventCases[id].events.reduce((value,symbol)=>{const handler={sun,moon}[symbol];return handler==='increment'?value+1:handler==='reset'?0:value;},0);
    const result=schedules(id,{sun,moon});assert.equal(result.length,5);
    for(const s of result){assert.equal(s.value,expected);assert.deepEqual(s.processed.map(x=>x.symbol),eventCases[id].events);assert.equal(eventTrialCorrect(s),sun==='increment'&&moon==='reset');}
  }
});
test('sending does not execute and an empty queue cannot dispatch',()=>{
  let s=createEventTrial('resetLast',{sun:'increment',moon:'reset'});assert.deepEqual(eventStep(s,'dispatch').history,[]);s=eventStep(s,'signal');assert.equal(s.value,0);assert.deepEqual(s.queue,['sun']);s=eventStep(s,'dispatch');assert.equal(s.value,1);
});
test('drafts replay valid events and completion needs both trials',()=>{
  const h={sun:'increment',moon:'reset'},states={};for(const id of Object.keys(eventCases))states[id]={handlers:h,history:schedules(id,h)[0].history};const saved={selected:'resetLast',states};assert.equal(eventsComplete(restoreEvents(saved)),false);let mvc=createMvcLantern();for(const a of ['controller','model','view','controller','model','view'])mvc=stepMvcLantern(mvc,a);saved.mvc=mvc;assert.equal(eventsComplete(restoreEvents(saved)),true);assert.equal(eventsComplete(createEventSet()),false);
  assert.throws(()=>restoreEvents({...saved,states:{...states,resetLast:{handlers:h,history:['dispatch']}}}),RangeError);
});
