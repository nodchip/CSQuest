import test from 'node:test';
import assert from 'node:assert/strict';
import {timerProtectionModes,createTimerTrial,timerTrialAct,createTimerProtection,restoreTimerProtection,timerProtectionComplete} from '../src/timer-protection.js';
const act=(s,a)=>{const r=timerTrialAct(s,a);assert.equal(r.ok,true,`${s.mode}: ${a}: ${r.message}`);return r.state;};
function play(mode){let s=createTimerTrial(mode);for(const a of ['disable','tick','tick'])s=act(s,a);if(s.phase==='interrupt')s=act(s,'dispatch');return act(s,'tick');}
test('時計の有無と停止権限で割込みと B の進行が変わる',()=>{const a=play('cooperative'),b=play('unprotected'),c=play('protected');assert.equal(a.bDone,false);assert.equal(b.bDone,false);assert.equal(b.timer,false);assert.equal(c.timer,true);assert.equal(c.bDone,true);for(const t of [a,b,c])assert.equal(t.phase,'done');});
test('割込み中は司令室で B を選ぶ必要がある',()=>{let s=createTimerTrial('protected');for(const a of ['disable','tick','tick'])s=act(s,a);assert.equal(s.phase,'interrupt');assert.equal(timerTrialAct(s,'tick').ok,false);s=act(s,'dispatch');assert.equal(s.running,'B');s=act(s,'tick');assert.equal(s.bDone,true);});
test('３方式と振り返りが必要で、途中記録を再生する',()=>{const s=createTimerProtection();for(const k of Object.keys(timerProtectionModes))s.trials[k]=play(k);s.answer='hardware';assert.equal(timerProtectionComplete(s),false);s.checked=true;assert.equal(timerProtectionComplete(s),true);assert.deepEqual(restoreTimerProtection(JSON.parse(JSON.stringify(s))),s);const bad=JSON.parse(JSON.stringify(s));bad.trials.protected.history=['tick'];assert.throws(()=>restoreTimerProtection(bad));});
