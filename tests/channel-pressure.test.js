import test from 'node:test';
import assert from 'node:assert/strict';
import {channelPressureModes,channelPressureCapacities,channelPressureJobs,channelPressureTrace,channelPressureCreate,channelPressureDone,channelPressureComplete,channelPressureRestore} from '../src/channel-pressure.js';

test('each tick conserves the five jobs and the four bounded-channel outcomes',()=>{
 const expected={'wait:0':[['甲','乙','丙','丁','戊'],[],4,10],'wait:1':[['甲','乙','丙','丁','戊'],[],2,10],'drop:0':[['甲','丙','戊'],['乙','丁'],0,6],'drop:1':[['甲','乙','丙','戊'],['丁'],0,8]};
 for(const mode of channelPressureModes)for(const capacity of channelPressureCapacities){const t=channelPressureTrace(mode,capacity),[completed,dropped,waits,end]=expected[`${mode}:${capacity}`];assert.deepEqual(t.completed,completed);assert.deepEqual(t.dropped,dropped);assert.equal(t.waits,waits);assert.equal(t.rows.at(-1).time,end);
  for(const row of t.rows){const all=[...row.completed,...row.dropped,...row.pending,...row.buffer,...(row.active?[row.active]:[])];assert.equal(row.buffer.length<=capacity,true);assert.equal(new Set(all).size,all.length);assert.deepEqual([...all].sort(),channelPressureJobs.slice(0,Math.min(row.time+1,5)).sort());}
 }
});
test('all four observed outcomes and the tradeoff reflection are needed; draft state is validated',()=>{
 const s=channelPressureCreate();for(const mode of channelPressureModes)for(const capacity of channelPressureCapacities){const id=`${mode}:${capacity}`,trace=channelPressureTrace(mode,capacity),t=s.trials[id];t.step=trace.rows.length;t.answer=trace.dropped.length?'dropped':'all';t.checked=true;assert.equal(channelPressureDone(mode,capacity,t),true);}
 assert.equal(channelPressureComplete(s),false);s.reflection='tradeoff';assert.equal(channelPressureComplete(s),true);const copy=channelPressureRestore(s);copy.trials['wait:0'].step=0;assert.equal(channelPressureComplete(s),true);assert.throws(()=>channelPressureRestore(copy));
});
