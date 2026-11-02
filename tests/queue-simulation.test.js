import test from 'node:test';
import assert from 'node:assert/strict';
import {queueJobs} from '../src/queue-observation.js';
import {generateQueueJobs,simulateQueue,queueSimulationCreate,queueSimulationComplete,queueSimulationRestore} from '../src/queue-simulation.js';

test('the event simulation independently reproduces the known six-interval trace',()=>{
 const r=simulateQueue(queueJobs,6);assert.equal(r.arrivals,4);assert.equal(r.completed,3);assert.equal(r.unfinished,1);assert.equal(r.area,9);assert.equal(r.completedTime,7);assert.equal(r.unfinishedTime,2);assert.equal(r.meanCount,1.5);assert.equal(r.meanCompletedTime,7/3);
});
test('fixed seeds reproduce observations, preserve prefixes and conserve time',()=>{
 for(const seed of [11,37]){const short=generateQueueJobs(seed,10),long=generateQueueJobs(seed,1000);assert.deepEqual(long.filter(job=>job.arrival<10),short);assert.deepEqual(generateQueueJobs(seed,10),short);for(const [jobs,horizon] of [[short,10],[long,1000]]){const r=simulateQueue(jobs,horizon);assert.equal(r.arrivals,r.completed+r.unfinished);assert.ok(Math.abs(r.area-r.completedTime-r.unfinishedTime)<1e-8);assert.ok(r.completed>0);}}
 assert.throws(()=>simulateQueue([{arrival:1,service:0}],10));assert.throws(()=>generateQueueJobs(9,10));
});
test('all four observations, answer and reflection are required; saved observations are copied',()=>{
 const s=queueSimulationCreate();for(const key of Object.keys(s.observed))s.observed[key]=true;s.answer='sample';s.checked=true;assert.equal(queueSimulationComplete(s),false);s.reflection='limits';assert.equal(queueSimulationComplete(s),true);const copy=queueSimulationRestore(s);copy.observed['11:10']=false;assert.equal(queueSimulationComplete(copy),false);assert.equal(queueSimulationComplete(s),true);copy.observed['37:10']='yes';assert.throws(()=>queueSimulationRestore(copy));
});
