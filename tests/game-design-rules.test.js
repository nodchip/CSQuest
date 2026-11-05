import test from 'node:test';
import assert from 'node:assert/strict';
import {designRulesCreate,designRulesReplay,designRulesChallenge,designRulesDone,designRulesRestore} from '../src/game-design-rules.js';
import {createCaptions,restoreCaptions} from '../src/game-captions.js';

test('three arrows reflect both rules and all action choices',()=>{
 for(const mode of ['renew','limited'])for(let mask=0;mask<8;mask++){
  const history=Array.from({length:3},(_,i)=>mask&(1<<i)?'guard':'evade'),guards=history.filter(x=>x==='guard').length,r=designRulesReplay(mode,history);
  assert.equal(r.blocked,mode==='renew'?guards:Math.min(guards,2));assert.equal(r.hit,mode==='renew'?0:Math.max(guards-2,0));assert.equal(r.evaded,3-guards);assert.equal(r.shields,mode==='renew'?null:Math.max(2-guards,0));
 }
 assert.throws(()=>designRulesReplay('limited',['guard','guard','guard','guard']));
});
test('both rule histories, any personal feeling and correct reflection persist',()=>{
 const q=designRulesCreate();q.histories.renew=['guard','guard','guard'];q.histories.limited=['guard','guard','evade'];q.feel='other';assert(!designRulesDone(q));q.answer='options';assert(designRulesDone(q));const copy=designRulesRestore(q);copy.histories.renew.pop();assert.equal(q.histories.renew.length,3);assert.throws(()=>designRulesRestore({...q,feel:'guaranteed'}));const {design,...old}=createCaptions();assert.deepEqual(restoreCaptions(old),createCaptions());
});
test('the limited-shield challenge accepts every safe ordering of two guards and one dodge',()=>{
 const q=designRulesCreate();for(let mask=0;mask<8;mask++){q.histories.limited=Array.from({length:3},(_,i)=>mask&(1<<i)?'guard':'evade');assert.equal(designRulesChallenge(q),q.histories.limited.filter(x=>x==='guard').length===2);}q.histories.limited=['guard','evade'];assert(!designRulesChallenge(q));q.histories.limited=['guard','guard','guard'];q.histories.renew=['guard','guard','guard'];q.feel='free';q.answer='options';assert(!designRulesDone(q));
});
