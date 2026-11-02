import {test} from 'node:test';
import assert from 'node:assert/strict';
import {campusModes,campusFaults,campusEdges,campusResult,campusCreate,campusStep,campusComplete,campusRestore} from '../src/campus-topology.js';

test('redundant uplink tolerates a link failure but not shared switch failure',()=>{
 const expected={single:{none:'both',endpoint:'Bonly',uplink:'neither',switch:'neither'},redundant:{none:'both',endpoint:'Bonly',uplink:'both',switch:'neither'}};
 for(const [mode,faults] of Object.entries(expected))for(const [fault,result] of Object.entries(faults)){assert.equal(campusResult(mode,fault),result);assert.equal(campusEdges(mode,fault).filter(x=>x.id==='backup').length,mode==='redundant'?1:0);}
});
test('each scenario requires correct prediction and restoration validates records',()=>{
 const q=campusCreate();for(const mode of Object.keys(campusModes))for(const fault of Object.keys(campusFaults)){q.mode=mode;q.fault=fault;const result=campusResult(mode,fault),wrong=['both','Aonly','Bonly','neither'].find(x=>x!==result);assert.throws(()=>campusStep(q,wrong));campusStep(q,result);campusStep(q,result);assert.deepEqual(campusRestore(q),q);}assert.equal(q.done.length,8);assert(!campusComplete(q));q.answer='switch';assert(campusComplete(q));const bad=structuredClone(q);bad.done.push(bad.done[0]);assert.throws(()=>campusRestore(bad));
});
