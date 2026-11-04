import {linkCases,linkBest} from '../src/link-choice.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createTransportTrial,transportTrialStep,transportRecovery,createTransportNeeds,restoreTransportNeeds,transportNeedsComplete} from '../src/transport-needs.js';
function play(mode){let s=createTransportTrial(mode);for(let i=0;i<4;i++){const r=transportTrialStep(s);assert.equal(r.ok,true);s=r.state;}return s;}
test('同じ損失の固定例で、３刻目と４刻目の受信を比較する',()=>{const stream=play('stream'),udp=play('datagram');assert.deepEqual(stream.timeline[2].delivered,[1]);assert.deepEqual(stream.timeline[2].buffered,[3]);assert.deepEqual(stream.delivered,[1,2,3]);assert.deepEqual(stream.buffered,[]);assert.deepEqual(udp.timeline[2].delivered,[1,3]);assert.deepEqual(udp.delivered,[1,3]);assert.equal(transportTrialStep(stream).ok,false);});
test('両方式と用途に応じた選択が必要で、履歴を再生する',()=>{const s=createTransportNeeds();s.trials.stream=play('stream');s.trials.datagram=play('datagram');s.letter='stream';s.beacon='datagram';s.udp='application';assert.equal(transportNeedsComplete(s),false);s.checked=true;assert.equal(transportNeedsComplete(s),false);for(const id of Object.keys(linkCases))s.links[id]={observed:['near','wide'],choice:linkBest(id),checked:true};assert.equal(transportNeedsComplete(s),true);const {links,...old}=s;assert.equal(transportNeedsComplete(restoreTransportNeeds(old)),false);assert.deepEqual(restoreTransportNeeds(JSON.parse(JSON.stringify(s))),s);const bad=JSON.parse(JSON.stringify(s));bad.trials.stream.history[0]='invalid';assert.throws(()=>restoreTransportNeeds(bad));});
test('不正な方式や過剰な記録は拒否する',()=>{assert.throws(()=>createTransportTrial('other'));const s=createTransportNeeds();s.trials.stream.history=['step','step','step','step','step'];assert.throws(()=>restoreTransportNeeds(s));});
test('fixed recovery scenarios distinguish attempts, arrival and delivery order',()=>{
 assert.deepEqual(transportRecovery('stream',false,true),{attempted:true,received:true,delivered:[1,2,3],buffered:[]});
 assert.deepEqual(transportRecovery('stream',false,false),{attempted:true,received:false,delivered:[1],buffered:[3]});
 assert.deepEqual(transportRecovery('datagram',false,true),{attempted:false,received:false,delivered:[1,3],buffered:[]});
 assert.deepEqual(transportRecovery('datagram',true,true),{attempted:true,received:true,delivered:[1,3,2],buffered:[]});
 assert.deepEqual(transportRecovery('datagram',true,false),{attempted:true,received:false,delivered:[1,3],buffered:[]});
 assert.throws(()=>transportRecovery('datagram','yes',true));const old=createTransportNeeds();delete old.recovery;
 assert.deepEqual(restoreTransportNeeds(old).recovery,{mode:'stream',appRetry:false,success:true});
 assert.throws(()=>restoreTransportNeeds({...old,recovery:{mode:'bad',appRetry:true,success:true}}));
});
