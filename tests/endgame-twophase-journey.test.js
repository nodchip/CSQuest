import test from 'node:test';
import assert from 'node:assert/strict';
import {replayTwoPhaseJourney,advanceTwoPhaseJourney} from '../src/endgame-twophase-journey.js';
test('prepared participants wait for the coordinator; rejection leads to abort',()=>{
 const before=['prepareA','prepareB','crash','wait'];let p=replayTwoPhaseJourney('crash',before);
 assert.deepEqual([p.trial.up,p.trial.decision,p.trial.participants.A,p.trial.participants.B],[false,null,'準備済み','準備済み']);
 p=replayTwoPhaseJourney('crash',[...before,'recover','decide']);assert.equal(p.trial.decision,'確定');assert.deepEqual(p.trial.participants,{A:'準備済み',B:'準備済み'});
 p=replayTwoPhaseJourney('crash',[...before,'recover','decide','deliverA','deliverB']);assert.equal(p.done,true);assert.deepEqual(p.trial.participants,{A:'確定済み',B:'確定済み'});
 p=replayTwoPhaseJourney('reject',['prepareB','prepareA','decide','deliverB','deliverA']);assert.equal(p.trial.decision,'取消');assert.deepEqual(p.trial.participants,{A:'取消済み',B:'取消済み'});
 assert.equal(replayTwoPhaseJourney('compare',['inspect:reject','inspect:crash','answer:wait']).done,true);
});
test('invalid actions and answers rejected; restored progress and reset',()=>{
 assert.equal(advanceTwoPhaseJourney('crash',[],'decide'),null);
 let h=['prepareA','prepareB','crash'];assert.equal(advanceTwoPhaseJourney('crash',h,'decide'),null);
 h=advanceTwoPhaseJourney('crash',JSON.parse(JSON.stringify(h)),'wait');assert.equal(replayTwoPhaseJourney('crash',h).trial.blocked,true);
 assert.deepEqual(advanceTwoPhaseJourney('crash',h,'reset'),[]);
 assert.equal(advanceTwoPhaseJourney('compare',['inspect:crash'],'answer:wait'),null);
 assert.equal(advanceTwoPhaseJourney('reject',['prepareA','prepareB','decide','deliverA','deliverB'],'reset'),null);
});
