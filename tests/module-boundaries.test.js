import {test} from 'node:test';
import assert from 'node:assert/strict';
import {boundaryCases,boundaryResult,boundaryCasePass,createBoundary,boundaryComplete,restoreBoundary} from '../src/module-boundaries.js';

test('each of the four configurations is checked against both formats and valid or invalid requests',()=>{
 const passing=[];for(const display of ['direct','api'])for(const request of ['direct','api']){const c={display,request};if(Object.keys(boundaryCases).every(id=>boundaryCasePass(c,id)))passing.push(c);}
 assert.deepEqual(passing,[{display:'api',request:'api'}]);assert.deepEqual(boundaryResult({display:'direct',request:'api'},'newNormal'),{shown:null,status:'ok',remaining:1});assert.deepEqual(boundaryResult({display:'api',request:'direct'},'oldInvalid'),{shown:3,status:'ok',remaining:4});
});
test('completion requires current tests and valid saved state is copied',()=>{
 const s=createBoundary();s.config={display:'api',request:'api'};for(const id of Object.keys(boundaryCases))s.tested[id]=true;const copy=restoreBoundary(s);assert.equal(boundaryComplete(copy),true);s.config.request='direct';assert.equal(boundaryComplete(copy),true);assert.equal(boundaryComplete(s),false);assert.throws(()=>restoreBoundary({config:{display:'bad',request:'api'},tested:s.tested}),RangeError);
});
