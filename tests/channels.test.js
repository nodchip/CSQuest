import test from 'node:test';
import assert from 'node:assert/strict';
import {channelModes,channelMessages,createChannelTrial,channelStep,channelTrialComplete,createChannels,restoreChannels,channelsComplete} from '../src/channels.js';
test('capacity zero needs a receiver; capacity one allows one buffered message',()=>{
 let a=createChannelTrial('rendezvous');a=channelStep(a,'send');assert.equal(a.pending,'赤の伝言');assert.deepEqual(a.queue,[]);let unchanged=channelStep(a,'send');assert.equal(unchanged.history.length,1);a=channelStep(a,'receive');assert.equal(a.pending,null);assert.deepEqual(a.received,['赤の伝言']);
 let b=createChannelTrial('buffered');b=channelStep(b,'send');assert.deepEqual(b.queue,['赤の伝言']);assert.equal(b.pending,null);b=channelStep(b,'send');assert.equal(b.pending,'青の伝言');b=channelStep(b,'receive');assert.deepEqual(b.received,['赤の伝言']);assert.deepEqual(b.queue,['青の伝言']);assert.equal(b.pending,null);
});
test('all legal histories preserve order and capacity, and both modes can complete and restore',()=>{
 for(const mode of Object.keys(channelModes)){let stack=[createChannelTrial(mode)],found=0;while(stack.length){const s=stack.pop();assert.ok(s.queue.length<=channelModes[mode].capacity);assert.deepEqual(s.received,channelMessages.slice(0,s.received.length));if(channelTrialComplete(s))found++;if(s.history.length===4)continue;for(const a of ['send','receive']){const next=channelStep(s,a);if(next.history.length>s.history.length)stack.push(next);}}assert.ok(found>0);}
 const s=createChannels();for(const action of ['send','receive','send','receive'])s.states.rendezvous=channelStep(s.states.rendezvous,action);for(const action of ['send','send','receive','receive'])s.states.buffered=channelStep(s.states.buffered,action);assert.equal(channelsComplete(s),true);const restored=restoreChannels({selected:'buffered',histories:{rendezvous:s.states.rendezvous.history,buffered:s.states.buffered.history}});assert.equal(channelsComplete(restored),true);assert.throws(()=>restoreChannels({selected:'buffered',histories:{rendezvous:['receive'],buffered:[]}}),RangeError);
});
