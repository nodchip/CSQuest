import test from 'node:test';
import assert from 'node:assert/strict';
import {queueRates,queueCases,queueMetrics,queueModelCreate,queueModelDone,queueModelComplete,queueModelRestore} from '../src/queue-model.js';

test('stable values include the server and satisfy Little’s law; boundary and overload have no steady-state values',()=>{
 const expected={1:[1/4,1/3,1/3,1/12,1/12],2:[1/2,1,1/2,1/2,1/4],3:[3/4,3,1,9/4,3/4]};
 for(const [rate,values] of Object.entries(expected)){const m=queueMetrics(Number(rate));assert.equal(m.stable,true);assert.deepEqual([m.utilization,m.system,m.time,m.waiting,m.waitTime],values);assert.equal(m.system,Number(rate)*m.time);assert.equal(m.waiting,Number(rate)*m.waitTime);}
 for(const rate of [4,5])assert.deepEqual(queueMetrics(rate),{stable:false,utilization:null,system:null,time:null,waiting:null,waitTime:null});assert.throws(()=>queueMetrics(0));
});
test('all five checked predictions and the model limitations reflection are required',()=>{
 const s=queueModelCreate();for(const rate of queueRates){const c=queueCases[rate];for(const size of ['third','one','three','none'])for(const time of ['third','half','one','none'])for(const checked of [false,true])assert.equal(queueModelDone(rate,{size,time,checked}),checked&&size===c.size&&time===c.time);s.trials[rate]={...c,checked:true};}
 assert.equal(queueModelComplete(s),false);s.reflection='model';assert.equal(queueModelComplete(s),true);const copy=queueModelRestore(s);copy.trials[1].size='none';assert.equal(queueModelComplete(copy),false);assert.equal(queueModelComplete(s),true);copy.trials[2].time='unknown';assert.throws(()=>queueModelRestore(copy));
});
