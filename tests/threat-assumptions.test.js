import test from 'node:test';
import assert from 'node:assert/strict';
import {assumptionRoutes,assumptionResult,createAssumptions,inspectAssumptions,assumptionsComplete,restoreAssumptions} from '../src/threat-assumptions.js';

test('all eight combinations reopen only routes with failed premises',()=>{
 const keys=Object.keys(assumptionRoutes);for(let n=0;n<8;n++){const failed=keys.filter((_,i)=>n&(1<<i)),r=assumptionResult(failed);assert.deepEqual(r.open,failed);assert.equal(r.score,failed.reduce((sum,k)=>sum+assumptionRoutes[k].impact,0));}
 assert.throws(()=>assumptionResult(['gate','gate']));
});
test('required observations persist and old saves start without observations',()=>{
 let s=createAssumptions();for(const failed of [[],['gate'],['message','backup'],['gate','message','backup']]){s.failed=failed;s=inspectAssumptions(s);}assert.ok(assumptionsComplete(s));assert.deepEqual(restoreAssumptions(s),s);assert.equal(assumptionsComplete(restoreAssumptions(undefined)),false);
 assert.throws(()=>restoreAssumptions({...s,observed:['invalid']}));assert.throws(()=>restoreAssumptions({...s,failed:['gate'],observed:[],shown:true}));
});
