import test from 'node:test';
import assert from 'node:assert/strict';
import {channelKinds,channelOrders,channelInitial,channelEnabled,channelAdvance,channelReplay,channelStatus,channelAnalyze,channelReachabilityCreate,channelReachabilityDone,channelReachabilityComplete,channelReachabilityRestore} from '../src/channel-reachability.js';

test('the complete reachable state graphs distinguish deadlock from completion',()=>{
 const expected={'sync:send':[1,false,true],'sync:receive':[3,true,false],'buffer:send':[7,true,false],'buffer:receive':[5,true,false]};
 for(const kind of channelKinds)for(const order of channelOrders){const result=channelAnalyze(kind,order),[states,complete,deadlock]=expected[`${kind}:${order}`];assert.equal(result.states,states);assert.equal(result.complete!==null,complete);assert.equal(result.deadlock!==null,deadlock);if(complete)assert.equal(channelStatus(kind,order,channelReplay(kind,order,result.complete)),'complete');if(deadlock)assert.equal(channelStatus(kind,order,channelReplay(kind,order,result.deadlock)),'deadlock');}
 assert.deepEqual(channelEnabled('sync','send',channelInitial()),[]);assert.throws(()=>channelAdvance('sync','send',channelInitial(),'ab'));
});
test('all reachable buffered transitions preserve one-slot capacities and valid program steps',()=>{
 for(const order of channelOrders){const seen=new Set(),queue=[channelInitial()];while(queue.length){const state=queue.shift(),key=JSON.stringify(state);if(seen.has(key))continue;seen.add(key);assert.ok([0,1].includes(state.ab)&&[0,1].includes(state.ba));assert.ok(state.a<=2&&state.b<=2);for(const action of channelEnabled('buffer',order,state))queue.push(channelAdvance('buffer',order,state,action));}}
});
test('each terminal trace and its analysis plus reflection are required and saved histories validate',()=>{
 const s=channelReachabilityCreate();for(const kind of channelKinds)for(const order of channelOrders){const a=channelAnalyze(kind,order),t=s.trials[`${kind}:${order}`];t.history=a.complete??a.deadlock;assert.equal(channelReachabilityDone(kind,order,t),false);t.analyzed=true;assert.equal(channelReachabilityDone(kind,order,t),true);}assert.equal(channelReachabilityComplete(s),false);s.reflection='scope';assert.equal(channelReachabilityComplete(s),true);const copy=channelReachabilityRestore(s);copy.trials['sync:receive'].history.pop();assert.equal(channelReachabilityComplete(copy),false);assert.equal(channelReachabilityComplete(s),true);copy.trials['sync:send'].history=['ab'];assert.throws(()=>channelReachabilityRestore(copy));
});
