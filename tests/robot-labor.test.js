import test from 'node:test';
import assert from 'node:assert/strict';
import {robotLaborValue,robotLaborCreate,robotLaborInspect,robotLaborDone,robotLaborRestore} from '../src/robot-labor.js';
test('published estimates have distinct units and local and aggregate scopes',()=>{
 assert.deepEqual(robotLaborValue('local','employment',1),{delta:0.39,baseline:60,result:59.61});
 assert.deepEqual(robotLaborValue('national','employment',1),{delta:0.2,baseline:60,result:59.8});
 assert.ok(Math.abs(robotLaborValue('local','wage',1).result-99.23)<1e-10);assert.ok(Math.abs(robotLaborValue('national','wage',1).result-99.58)<1e-10);
 for(const scope of ['local','national'])for(const measure of ['employment','wage'])assert.equal(robotLaborValue(scope,measure,0).result,measure==='employment'?60:100);
 assert.throws(()=>robotLaborValue('bad','wage',1),RangeError);
});
test('each comparison and both interpretations are required and survive restoration',()=>{let q=robotLaborCreate();robotLaborInspect(q);assert.deepEqual(q.seen,[]);q.exposure=1;for(const scope of ['local','national'])for(const measure of ['employment','wage']){q.scope=scope;q.measure=measure;robotLaborInspect(q);}assert.equal(robotLaborDone(q),false);q.unit='points';q.limits='context';q=robotLaborRestore(q);assert.equal(robotLaborDone(q),true);assert.throws(()=>robotLaborRestore({...q,seen:['local:bad']}),RangeError);});
