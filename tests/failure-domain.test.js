import {test} from 'node:test';
import assert from 'node:assert/strict';
import {failureCases,failureResult,createFailureDomain,failureDomainComplete,restoreFailureDomain} from '../src/failure-domain.js';
test('a shared panel is a single point of failure but separate paths still share a flood',()=>{
 assert.deepEqual(failureResult('shared','panel'),{a:false,b:false,available:false});assert.deepEqual(failureResult('separate','panel'),{a:true,b:true,available:true});for(const design of ['shared','separate']){assert.deepEqual(failureResult(design,'sourceA'),{a:false,b:true,available:true});assert.equal(failureResult(design,'flood').available,false);}assert.throws(()=>failureResult('bad','panel'),RangeError);
});
test('completion needs all fault trials, independent paths and copied saved state',()=>{
 const s=createFailureDomain();for(const id of Object.keys(failureCases))s.tested[id]=true;assert.equal(failureDomainComplete(s),false);s.design='separate';const copy=restoreFailureDomain(s);assert.equal(failureDomainComplete(copy),true);s.tested.flood=false;assert.equal(failureDomainComplete(copy),true);assert.equal(failureDomainComplete(s),false);assert.throws(()=>restoreFailureDomain({...copy,design:'bad'}),RangeError);
});
