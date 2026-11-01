import test from 'node:test';
import assert from 'node:assert/strict';
import {createSignalLab,signalLabStep,signalLabTrialComplete,signalLabComplete,restoreSignalLab} from '../src/process-signal-lab.js';

test('default, caught TERM and uncapturable KILL are distinct after delivery',()=>{
  const s=createSignalLab();for(const [id,actions] of Object.entries({termDefault:['send','deliver'],termHandler:['handler','send','deliver'],kill:['handler','send','deliver']})){
    for(const action of actions){const r=signalLabStep(id,s.trials[id],action);assert.equal(r.ok,true);s.trials[id]=r.state;}
    assert.equal(signalLabTrialComplete(id,s.trials[id]),true);
  }
  assert.equal(s.trials.termDefault.handled,false);assert.equal(s.trials.termHandler.handled,true);assert.equal(s.trials.kill.mode,'default');assert.equal(s.trials.kill.attempted,true);assert.equal(signalLabComplete(s),true);assert.deepEqual(restoreSignalLab(s),s);
});
test('delivery cannot precede sending and forged histories are rejected',()=>{
  const s=createSignalLab();assert.equal(signalLabStep('termDefault',s.trials.termDefault,'deliver').ok,false);assert.throws(()=>restoreSignalLab({...s,trials:{...s.trials,termDefault:{history:['deliver']}}}));
  let t=s.trials.termHandler;for(const action of ['send','deliver'])t=signalLabStep('termHandler',t,action).state;assert.equal(signalLabTrialComplete('termHandler',t),false);
});
