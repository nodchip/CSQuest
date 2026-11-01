import test from 'node:test';
import assert from 'node:assert/strict';
import {createTimerQueueLab,timerQueueAct,timerQueueDone,restoreTimerQueueLab} from '../src/timer-queue-lab.js';

test('new earlier timer is rearmed and same-time expirations are delivered together',()=>{
  let s=createTimerQueueLab();const actions=['arm:3','tick','insert','arm:2','advance','service','arm:3','advance','service','arm:7','advance','service'];
  for(const action of actions){const r=timerQueueAct(s,action);assert.equal(r.ok,true,action);s=r.state;}
  assert.equal(timerQueueDone(s),true);assert.equal(s.now,7);assert.deepEqual(s.delivered,['C','A','B','D']);assert.deepEqual(restoreTimerQueueLab(s),s);
  assert.equal(timerQueueAct(s,'advance').ok,false);
});
test('invalid orders and stale alarm cannot advance or mutate state',()=>{
  let s=createTimerQueueLab();assert.equal(timerQueueAct(s,'arm:7').ok,false);assert.equal(timerQueueAct(s,'tick').ok,false);
  for(const action of ['arm:3','tick','insert'])s=timerQueueAct(s,action).state;
  const before=structuredClone(s);assert.equal(s.armed,3);assert.equal(timerQueueAct(s,'advance').ok,false);assert.deepEqual(s,before);
  assert.throws(()=>restoreTimerQueueLab({history:['arm:3','tick','insert','advance']}));
});
