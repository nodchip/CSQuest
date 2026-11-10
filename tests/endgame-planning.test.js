import test from 'node:test';
import assert from 'node:assert/strict';
import {planningApplicable,planningApply,replayPlanning} from '../src/endgame-planning.js';
test('actions check preconditions and change only their stated fields',()=>{
 const initial={location:'入口',shelf:true,held:false,door:false,parcel:true,delivered:false};assert.equal(planningApplicable(initial,'open'),false);assert.equal(planningApply(initial,'open'),null);
 assert.deepEqual(initial,{location:'入口',shelf:true,held:false,door:false,parcel:true,delivered:false});
 const key=planningApply(initial,'take');assert.deepEqual(key,{location:'入口',shelf:false,held:true,door:false,parcel:true,delivered:false});
 assert.deepEqual(planningApply(key,'open'),{location:'入口',shelf:false,held:true,door:true,parcel:true,delivered:false});
});
test('available actions and absence of applicable actions use the current state',()=>{
 const sequence=['choose:take','check','choose:open','check','choose:pass','check','choose:deliver','check','choose:none','check'];assert.equal(replayPlanning('rules',sequence).done,true);
 assert.equal(replayPlanning('rules',['choose:open','check']),null);
});
test('different initial states allow different plans, including both valid orders',()=>{
 assert.equal(replayPlanning('plan',['do:open']),null);
 const first=['do:take','do:open','do:pass','do:deliver','check'];const saved=JSON.parse(JSON.stringify(['do:take','do:open']));assert.equal(replayPlanning('plan',saved).state.door,true);
 const direct=[...first,'do:pass','do:deliver','check'];assert.equal(replayPlanning('plan',direct).done,true);
 const alternative=[...first,'do:take','do:pass','do:deliver','check'];const result=replayPlanning('plan',alternative);assert.equal(result.done,true);assert.deepEqual(result.results.map(x=>x.state.delivered),[true,true]);assert.equal(replayPlanning('plan',[...alternative,'do:take']),null);
});
test('incomplete goals can be reset and require an explicit confirmation',()=>{
 assert.equal(replayPlanning('steps',['do:take','check']),null);
 const p=replayPlanning('steps',['do:take','reset']);assert.equal(p.state.shelf,true);assert.equal(p.state.held,false);
 assert.equal(replayPlanning('steps',['do:take','do:open','check','do:open','do:pass','check']).done,true);
});
