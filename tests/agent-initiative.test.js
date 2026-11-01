import test from 'node:test';
import assert from 'node:assert/strict';
import {createInitiative,initiativeAct,restoreInitiative,initiativeComplete} from '../src/agent-initiative.js';
const act=(s,a)=>{const r=initiativeAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
test('a stale plan is blocked at departure and mixed confirmation is invalidated by change',()=>{
 let s=createInitiative();for(const a of ['mode:manual','scene:open','human:short','event:close','depart'])s=act(s,a);
 assert.equal(s.report.blocked,true);assert.equal(s.report.stale,true);assert.equal(s.staleSeen,true);assert.deepEqual(s.seen,[]);
 for(const a of ['mode:mixed','scene:open','agent:plan','approve','event:close'])s=act(s,a);
 assert.equal(s.approved,false);assert.equal(initiativeAct(s,'depart').ok,false);
 for(const a of ['agent:plan','approve','depart'])s=act(s,a);assert.equal(s.report.blocked,false);assert.equal(s.report.route,'long');
});
test('all modes, bridge conditions, mixed initiators and reflection are required',()=>{
 let s=createInitiative();for(const a of ['scene:open','human:short','event:close','depart'])s=act(s,a);
 for(const mode of ['manual','auto','mixed'])for(const closed of [false,true]){
  s=act(s,`mode:${mode}`);s=act(s,`scene:${closed?'closed':'open'}`);
  s=act(s,mode==='manual'||(mode==='mixed'&&!closed)?`human:${closed?'long':'short'}`:'agent:plan');
  if(mode==='mixed')s=act(s,'approve');s=act(s,'depart');assert.equal(s.report.blocked,false);
 }
 assert.deepEqual(new Set(s.mixedSources),new Set(['human','agent']));
 for(const a of ['answer:auto','check'])s=act(s,a);assert.equal(initiativeComplete(s),false);
 for(const a of ['answer:shared','check'])s=act(s,a);assert.equal(initiativeComplete(s),true);
 assert.deepEqual(restoreInitiative(JSON.parse(JSON.stringify(s))),s);assert.throws(()=>restoreInitiative({history:['depart']}),RangeError);
});
