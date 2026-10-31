import {test} from 'node:test';
import assert from 'node:assert/strict';
import {packetQueueTrace,createPacketQueue,packetQueueComplete,restorePacketQueue} from '../src/packet-queue.js';
test('burst fills the two packet queue before service, while spacing delivers all packets',()=>{
 const b=packetQueueTrace('burst',3),s=packetQueueTrace('spaced',3);assert.deepEqual(b.events[0],{time:0,arrivals:['Ａ','Ｂ','Ｃ'],accepted:['Ａ','Ｂ'],lost:['Ｃ'],sent:'Ａ',waiting:['Ｂ']});assert.deepEqual(b.delivered,['Ａ','Ｂ']);assert.deepEqual(b.dropped,['Ｃ']);assert.deepEqual(s.delivered,['Ａ','Ｂ','Ｃ']);assert.deepEqual(s.dropped,[]);assert.throws(()=>packetQueueTrace('burst',4),RangeError);
});
test('both runs and a checked comparison are necessary; saved data is copied',()=>{const s=createPacketQueue();s.ticks={burst:3,spaced:3};s.answer='spaced';s.checked=true;const copy=restorePacketQueue(s);s.ticks.spaced=2;assert.equal(packetQueueComplete(s),false);assert.equal(packetQueueComplete(copy),true);assert.throws(()=>restorePacketQueue({...copy,ticks:{burst:4,spaced:3}}),RangeError);});
