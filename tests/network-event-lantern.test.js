import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {networkEventCases,networkEventParse,networkEventCreate,networkEventApply,networkEventDone,networkEventRestore} from '../src/network-event-lantern.js';

test('fixed response files match their type and reject incorrect or malformed payloads',async()=>{
 for(const [id,c] of Object.entries(networkEventCases)){
  const payload=JSON.parse(await readFile(new URL(`../data/${c.file}`,import.meta.url),'utf8'));
  assert.deepEqual(networkEventParse(id,payload),{signal:id,lamp:c.lamp});
  for(const bad of [null,{}, {...payload,version:2},{...payload,lamp:id==='north'?'lower':'upper'},{...payload,signal:'other'}])assert.throws(()=>networkEventParse(id,bad));
 }
});
test('only correctly routed events count and changed mappings prevent completion',()=>{
 const q=networkEventCreate();q.handlers.north='lower';assert.equal(networkEventApply(q,{signal:'north',lamp:'upper'}).correct,false);assert.deepEqual(q.seen,[]);
 q.handlers.north='upper';q.handlers.south='lower';for(const [signal,lamp] of [['north','upper'],['south','lower']])assert.equal(networkEventApply(q,{signal,lamp}).correct,true);
 q.answer='async';q.checked=true;assert.equal(networkEventDone(q),true);q.handlers.north='lower';assert.equal(networkEventDone(q),false);
 const copy=networkEventRestore(q);copy.seen.pop();assert.equal(q.seen.length,2);q.seen.push('north');assert.throws(()=>networkEventRestore(q));
});
