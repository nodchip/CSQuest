import test from 'node:test';
import assert from 'node:assert/strict';
import {vmTrapCreate,vmTrapTrial,vmTrapStep,vmTrapRestore,vmTrapComplete} from '../src/vm-trap.js';

test('guarded writes trap before any change, retain per-guest settings, and direct access leaks settings',()=>{
 const s=vmTrapCreate();
 for(const [mode,expected] of [['direct',{a:9,b:7}],['guarded',{a:7,b:0}]]){
  const t=s.trials[mode];assert.equal(vmTrapStep(t,mode,'read'),false);
  for(const action of mode==='direct'?['write','switch','read','write','switch','read']:['write','handle','switch','read','write','handle','switch','read']){
   const previous=t.physical;assert.equal(vmTrapStep(t,mode,action),true);
   if(mode==='guarded'&&action==='write'){assert.equal(t.physical,previous);assert.ok(t.pending);}
  }
  assert.deepEqual(t.seen,expected);assert.equal(vmTrapStep(t,mode,'write'),false);
 }
 s.answer='trap';s.checked=true;assert.ok(vmTrapComplete(s));assert.deepEqual(vmTrapRestore(s).trials.guarded.seen,{a:7,b:0});
});
test('all permitted histories preserve isolation and replay; malformed histories are rejected',()=>{
 for(const mode of ['direct','guarded']){
  const visit=t=>{const s=vmTrapCreate();s.trials[mode]=t;assert.deepEqual(vmTrapRestore(s).trials[mode],t);if(mode==='guarded'){if(t.seen.a!==null)assert.equal(t.seen.a,7);if(t.seen.b!==null)assert.equal(t.seen.b,0);}for(const a of ['write','handle','switch','read']){const next=vmTrapTrial();for(const h of t.history)vmTrapStep(next,mode,h);if(vmTrapStep(next,mode,a))visit(next);}};visit(vmTrapTrial());
 }
 const s=vmTrapCreate();s.trials.guarded.history=['handle'];assert.throws(()=>vmTrapRestore(s));
});
