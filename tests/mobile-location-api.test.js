import test from 'node:test';
import assert from 'node:assert/strict';
import {locationApiCreate,locationApiResult,locationApiRun,locationApiDone,locationApiRestore} from '../src/mobile-location-api.js';
import {createMobileLocation,restoreMobileLocation} from '../src/mobile-location.js';

test('permission, source, manual region and connectivity control the fixed request',()=>{
 for(const permission of ['allowed','denied'])for(const source of ['auto','manual'])for(const manual of ['north','south'])for(const network of ['online','offline']){
  const q={...locationApiCreate(),permission,source,manual,network},r=locationApiResult(q);if(source==='auto'&&permission==='denied')assert.deepEqual(r,{status:'permission',region:null});else assert.deepEqual(r,{status:network==='online'?'ok':'offline',region:source==='auto'?'north':manual});
 }
});
test('three observed cases, reflection and legacy drafts restore',()=>{
 const q=locationApiCreate();locationApiRun(q);q.permission='denied';q.source='manual';q.manual='south';locationApiRun(q);q.network='offline';locationApiRun(q);assert(!locationApiDone(q));q.answer='limited';assert(locationApiDone(q));const copy=locationApiRestore(q);copy.observed.pop();assert.equal(q.observed.length,3);assert.throws(()=>locationApiRestore({...q,observed:['auto','auto']}));const {api,...old}=createMobileLocation();assert.deepEqual(restoreMobileLocation(old),createMobileLocation());
});
