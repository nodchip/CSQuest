import test from 'node:test';
import assert from 'node:assert/strict';
import {roamingCases,roamingAvailable,createRoamingTrial,roamingStep,createRoaming,roamingComplete,restoreRoaming} from '../src/wireless-roaming.js';
test('joining and roaming require a reachable selected and confirmed access point',()=>{
 const s=createRoaming();assert.deepEqual(roamingAvailable('hill'),['a']);assert.deepEqual(roamingAvailable('valley'),['b']);
 for(const [id,actions] of Object.entries({join:['scan','a','auth','associate','send'],move:['move','scan','b','auth','associate','send']})){let t=s.trials[id];if(id==='move'){t=roamingStep(id,t,'move');assert.equal(t.connected,null);assert.equal(roamingStep(id,t,'send').sent,false);actions.shift();}assert.equal(roamingStep(id,t,'associate').history.length,t.history.length);for(const action of actions)t=roamingStep(id,t,action);assert.equal(t.sent,true);s.trials[id]=t;}
 assert.equal(roamingComplete(s),true);assert.deepEqual(restoreRoaming(s),s);
});
test('scan results are invalidated by movement and history cannot invent a connection',()=>{
 let t=createRoamingTrial('move');t=roamingStep('move',t,'scan');t=roamingStep('move',t,'a');t=roamingStep('move',t,'auth');t=roamingStep('move',t,'move');assert.equal(t.scanned,false);assert.equal(t.candidate,null);assert.equal(t.authenticated,false);assert.equal(roamingStep('move',t,'associate').connected,null);const s=createRoaming();s.trials.move=t;const copy=restoreRoaming(s);copy.trials.move.history.push('send');assert.throws(()=>restoreRoaming(copy));assert.notEqual(s.trials.move.history.at(-1),'send');assert.deepEqual(Object.keys(roamingCases),['join','move']);
});
