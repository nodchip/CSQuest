import test from 'node:test';
import assert from 'node:assert/strict';
import {locationApiCreate,locationApiResult,locationApiRun,locationApiDone,locationApiErrorDone,locationApiRestore} from '../src/mobile-location-api.js';
import {createMobileLocation,restoreMobileLocation} from '../src/mobile-location.js';

test('permission, source, manual region and connectivity control the fixed request',()=>{
 for(const permission of ['allowed','denied'])for(const source of ['auto','manual'])for(const manual of ['north','south'])for(const network of ['online','offline'])for(const server of ['ok','error']){
  const q={...locationApiCreate(),permission,source,manual,network,server},r=locationApiResult(q);if(source==='auto'&&permission==='denied')assert.deepEqual(r,{status:'permission',region:null});else assert.deepEqual(r,{status:network==='offline'?'offline':server==='error'?'server':'ok',region:source==='auto'?'north':manual});
 }
});
test('an offline failure differs from an error response, and old drafts migrate',()=>{
 const q=locationApiCreate();q.server='error';assert.deepEqual(locationApiRun(q),{status:'server',region:'north'});q.network='offline';assert.deepEqual(locationApiRun(q),{status:'offline',region:'north'});q.errorAnswer='distinguish';assert(locationApiErrorDone(q));q.permission='denied';assert.deepEqual(locationApiResult(q),{status:'permission',region:null});const {server,errorAnswer,...legacy}=locationApiCreate();assert.deepEqual(locationApiRestore(legacy),locationApiCreate());
});
test('three observed cases, reflection and legacy drafts restore',()=>{
 const q=locationApiCreate();locationApiRun(q);q.permission='denied';q.source='manual';q.manual='south';locationApiRun(q);q.network='offline';locationApiRun(q);assert(!locationApiDone(q));q.answer='limited';assert(locationApiDone(q));const copy=locationApiRestore(q);copy.observed.pop();assert.equal(q.observed.length,3);assert.throws(()=>locationApiRestore({...q,observed:['auto','auto']}));const {api,...old}=createMobileLocation();assert.deepEqual(restoreMobileLocation(old),createMobileLocation());
});
