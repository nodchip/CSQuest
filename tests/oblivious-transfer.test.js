import test from 'node:test';
import assert from 'node:assert/strict';
import {otN,otKeys,otMessages,otValues,otBruteOther,otRequestCounts,otCreate,otComplete,otRestore} from '../src/oblivious-transfer.js';

test('all 55 masks decode the selected message and permit either selection for each request',()=>{
 const requests=[new Map(),new Map()];
 for(const b of [0,1])for(let k=0;k<otN;k++){
  const v=otValues(b,k);assert.equal(v.received,otMessages[b]);assert.equal(v.masks[b],k);
  assert.equal(otBruteOther(b,v.request,v.sealed).message,otMessages[1-b]);
  requests[b].set(v.request,(requests[b].get(v.request)||0)+1);
 }
 assert.equal(requests[0].size,otN);assert.equal(requests[1].size,otN);
 for(let request=0;request<otN;request++){assert.equal(requests[0].get(request),1);assert.equal(requests[1].get(request),1);assert.deepEqual(otRequestCounts(request),[1,1]);}
 const first=new Set(otKeys.map(k=>otValues(0,k).request));assert.ok(otKeys.every(k=>!first.has(otValues(1,k).request)));
});
test('both tours and the limits reflection are required; draft records are validated',()=>{
 const s=otCreate();s.trials=[{key:3,stage:4},{key:7,stage:4}];assert.equal(otComplete(s),false);s.reflection='toy';assert.equal(otComplete(s),true);
 const copy=otRestore(s);copy.trials[0].stage=0;assert.equal(otComplete(s),true);
 for(const trial of [{key:null,stage:1},{key:2,stage:4},{key:3,stage:5}])assert.throws(()=>otRestore({...s,trials:[trial,s.trials[1]]}));
});
