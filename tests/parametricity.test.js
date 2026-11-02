import test from 'node:test';
import assert from 'node:assert/strict';
import {paramCreate,paramResult,paramTry,paramComplete,paramRestore,paramMachines,paramProof} from '../src/parametricity.js';

test('all input pairs and mappings agree with independent definitions',()=>{
 for(const a of ['red','blue','green'])for(const b of ['red','blue','green'])for(const left of ['moon','star'])for(const right of ['moon','star'])for(const machine of Object.keys(paramMachines)){
  const s=paramCreate();Object.assign(s,{left,right,machine,map:{moon:a,star:b}});const r=paramResult(s),map=x=>x==='moon'?a:b,source=machine==='second'?right:machine==='constant'?'moon':left,target=machine==='second'||machine==='typecase'?map(right):machine==='constant'?'red':map(left);
  assert.equal(r.after,map(source));assert.equal(r.before,target);assert.equal(r.same,map(source)===target);if(machine==='first'||machine==='second')assert.ok(r.same);
 }
});
test('nonuniform implementations have both misleading matches and counterexamples',()=>{
 const s=paramCreate();s.machine='typecase';s.map={moon:'red',star:'red'};assert.ok(paramResult(s).same);s.map.star='blue';assert.equal(paramResult(s).same,false);s.machine='constant';assert.ok(paramResult(s).same);s.map.moon='green';assert.equal(paramResult(s).same,false);
});
test('each observation, the proof and valid saved choices are needed',()=>{
 const s=paramCreate();for(const machine of ['first','second','typecase','constant']){s.machine=machine;for(const [moon,star] of [['red','red'],['green','blue']]){s.map={moon,star};s.guess=paramResult(s).same;assert.ok(paramTry(s).ok);}}
 assert.equal(paramComplete(s),false);s.answers=paramProof.map(p=>p.answer);s.checked=true;assert.ok(paramComplete(s));const copy=paramRestore(s);copy.flags.pop();assert.notEqual(copy.flags.length,s.flags.length);assert.throws(()=>paramRestore({...s,map:{moon:'red',star:'orange'}}));s.guess=!paramResult(s).same;assert.equal(paramTry(s).ok,false);
});
