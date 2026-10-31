import {test} from 'node:test';
import assert from 'node:assert/strict';
import {quantizeReading,quantizationReadings,createQuantization,quantizationStep,quantizationComplete,restoreQuantization} from '../src/sensor-quantization.js';

test('fixed intervals include lower edges, distinguish clipping, and merge distinct values',()=>{
 for(const [x,code,clipped] of [[0,'00',false],[.2,'00',false],[.8,'00',false],[1,'01',false],[2,'10',false],[3,'11',false],[3.99,'11',false],[4,'11',true],[4.2,'11',true]])assert.deepEqual(quantizeReading(x),{code,clipped});
 assert.throws(()=>quantizeReading(-1),RangeError);assert.throws(()=>quantizeReading(NaN),RangeError);
});
test('all samples must be correctly classified and persisted history must replay',()=>{
 let s=createQuantization();assert.equal(quantizationStep(s,'11',false).history.length,0);for(const value of quantizationReadings){const e=quantizeReading(value);s=quantizationStep(s,e.code,e.clipped);}assert.equal(quantizationComplete(s),true);
 const saved={history:s.history.map(x=>({...x})),choice:{...s.choice}};assert.equal(quantizationComplete(restoreQuantization(saved)),true);saved.history[5].clipped=false;assert.throws(()=>restoreQuantization(saved),RangeError);
});
