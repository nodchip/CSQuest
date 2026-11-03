import test from 'node:test';
import assert from 'node:assert/strict';
import {commitGateCreate,commitGateAct,commitGateRestore,commitGateDone} from '../src/checkpoint-tests.js';
const act=(s,a)=>{const r=commitGateAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
test('local and shared checks inspect different snapshots and repairs require fresh checks',()=>{
 let s=commitGateCreate();for(const a of ['local','repair','local','commit','share','ci'])s=act(s,a);
 assert.deepEqual(s.local,{version:'B',pass:true});assert.deepEqual(s.ci,{version:'B',pass:false});assert.equal(s.cost,5);
 s=act(s,'repair');assert.equal(s.version,'C');assert.equal(s.ci.version,'B');assert.equal(commitGateAct(s,'commit').ok,false);
 for(const a of ['local','commit','share','ci','answer:both'])s=act(s,a);
 assert.equal(s.cost,9);assert.equal(commitGateDone(s),true);assert.deepEqual(commitGateRestore(JSON.parse(JSON.stringify(s))),s);
});
test('early or forged operations cannot stand in for checks',()=>{
 const s=commitGateCreate();for(const a of ['repair','commit','share','ci'])assert.equal(commitGateAct(s,a).ok,false);
 assert.throws(()=>commitGateRestore({history:['share']}));assert.throws(()=>commitGateRestore({history:[null]}));assert.throws(()=>commitGateRestore({history:Array(65).fill('local')}));
});
