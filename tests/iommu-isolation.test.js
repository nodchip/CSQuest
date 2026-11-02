import {test} from 'node:test';
import assert from 'node:assert/strict';
import {iommuModes,iommuAddresses,iommuResult,iommuCreate,iommuStep,iommuComplete,iommuRestore} from '../src/iommu-isolation.js';

test('unrestricted, overbroad and narrow mappings produce the expected device reads',()=>{
 const expected={none:{x:'A',y:'B'},wide:{x:'A',y:'B'},narrow:{x:'A',y:'blocked'}};
 for(const [mode,addresses] of Object.entries(expected))for(const [address,result] of Object.entries(addresses))assert.equal(iommuResult(mode,address),result);
 assert.throws(()=>iommuResult('other','x'));assert.throws(()=>iommuResult('narrow','z'));
});
test('correct outcomes for every mapping and reflection are required; restore checks records',()=>{
 const q=iommuCreate();for(const mode of Object.keys(iommuModes))for(const address of Object.keys(iommuAddresses)){q.mode=mode;q.address=address;const result=iommuResult(mode,address);assert.throws(()=>iommuStep(q,['A','B','blocked'].find(x=>x!==result)));iommuStep(q,result);iommuStep(q,result);assert.deepEqual(iommuRestore(q),q);}assert.equal(q.done.length,6);assert(!iommuComplete(q));q.answer='mapping';assert(iommuComplete(q));const bad=structuredClone(q);bad.done.push(bad.done[0]);assert.throws(()=>iommuRestore(bad));
});
