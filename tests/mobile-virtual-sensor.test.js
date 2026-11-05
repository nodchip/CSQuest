import test from 'node:test';
import assert from 'node:assert/strict';
import {virtualSensorCreate,virtualSensorExpected,virtualSensorRun,virtualSensorDone,virtualSensorBoundaryDone,virtualSensorRestore} from '../src/mobile-virtual-sensor.js';
import {toolchainCreate,toolchainRestore} from '../src/mobile-toolchain.js';

test('two virtual values follow the stated threshold and incorrect predictions remain visible',()=>{
 const q=virtualSensorCreate();assert.throws(()=>virtualSensorRun(q));assert.equal(virtualSensorExpected(0),'off');assert.equal(virtualSensorExpected(9),'off');assert.equal(virtualSensorExpected(10),'on');assert.equal(virtualSensorExpected(12),'on');assert.throws(()=>virtualSensorExpected(11));q.guess='on';assert.equal(virtualSensorRun(q),'off');assert.deepEqual(q.last,{value:0,guess:'on'});assert.equal(q.guess,null);q.value=12;q.guess='on';virtualSensorRun(q);q.reflection='limits';assert(virtualSensorDone(q));const copy=virtualSensorRestore(q);copy.seen.pop();copy.last.guess='off';assert.deepEqual(q.seen,[0,12]);assert.equal(q.last.guess,'on');
});
test('legacy toolchain records migrate and impossible results are rejected',()=>{
 const {sensor,...old}=toolchainCreate();assert.deepEqual(toolchainRestore(old),toolchainCreate());assert.throws(()=>virtualSensorRestore({...virtualSensorCreate(),last:{value:12,guess:'on'}}));const {boundaryAnswer,...legacy}=virtualSensorCreate();assert.equal(virtualSensorRestore(legacy).boundaryAnswer,null);
});
test('boundary completion requires both observations and the inclusive interpretation',()=>{const q=virtualSensorCreate();q.boundaryAnswer='inclusive';q.value=9;q.guess='off';virtualSensorRun(q);assert(!virtualSensorBoundaryDone(q));q.value=10;q.guess='on';virtualSensorRun(q);assert(virtualSensorBoundaryDone(q));q.boundaryAnswer='above';assert(!virtualSensorBoundaryDone(q));});
