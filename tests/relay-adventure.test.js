import test from 'node:test';
import assert from 'node:assert/strict';
import {relayAct,relayNeighbors,createRelayAdventure,restoreRelayAdventure} from '../src/relay-adventure.js';
const act=(s,a)=>{const r=relayAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
const doAll=(s,actions)=>actions.reduce(act,s);
test('探索、競合の体験、鍵を使う記録、戦いと塔まで進める',()=>{
 let s=createRelayAdventure();assert.equal(relayAct(s,'move:tower').ok,false);
 s=doAll(s,['move:forge','step:A','step:B','step:A','step:B']);assert.equal(s.trial.value,1);assert.equal(s.seal,false);assert.equal(relayAct(s,'move:gate').ok,false);assert.equal(relayAct(s,'mode:locked').ok,false);
 s=doAll(s,['move:key','move:forge','mode:locked','step:A','step:B','step:A','step:A','step:A','step:B','step:B','step:B','step:B']);assert.equal(s.seal,true);assert.equal(s.trial.value,2);
 s=doAll(s,['move:gate','attack']);assert.equal(s.hp,2);s=doAll(s,['move:spring','move:gate']);assert.equal(s.hp,3);s=act(s,'attack');assert.equal(s.guardian,true);s=act(s,'move:tower');assert.equal(s.status,'won');assert.deepEqual(restoreRelayAdventure(JSON.parse(JSON.stringify(s))),s);
});
test('灯りが同じときの攻撃では失敗し、敗北後は進めない',()=>{
 let s=createRelayAdventure();s=doAll(s,['move:key','move:forge','mode:locked','step:A','step:A','step:A','step:A','step:B','step:B','step:B','step:B','move:gate','attack','guard','attack','attack']);assert.equal(s.status,'lost');assert.equal(relayAct(s,'move:spring').ok,false);
});
test('途中記録を再生し、不正操作を拒否する',()=>{
 let s=doAll(createRelayAdventure(),['move:key','move:forge','mode:locked','step:A','step:B']);assert.deepEqual(restoreRelayAdventure(s),s);assert.ok(relayNeighbors('camp').includes('spring'));assert.throws(()=>relayNeighbors('unknown'));assert.throws(()=>restoreRelayAdventure({history:['move:tower']}));assert.throws(()=>restoreRelayAdventure({history:[null]}));
});
