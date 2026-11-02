import {test} from 'node:test';
import assert from 'node:assert/strict';
import {centerLoads,centerServers,centerMeasure,centerCreate,centerRun,centerComplete,centerRestore} from '../src/data-center-energy.js';

test('capacity, IT energy and facility energy match independently calculated values',()=>{
 const expected={small:[{feasible:true,capacity:4,itWh:200,facilityWh:300},{feasible:true,capacity:8,itWh:300,facilityWh:450},{feasible:true,capacity:12,itWh:400,facilityWh:600},{feasible:true,capacity:16,itWh:500,facilityWh:750}],large:[{feasible:false,capacity:4},{feasible:true,capacity:8,itWh:400,facilityWh:600},{feasible:true,capacity:12,itWh:500,facilityWh:750},{feasible:true,capacity:16,itWh:600,facilityWh:900}]};
 for(const load of Object.keys(centerLoads))for(const n of centerServers)assert.deepEqual(centerMeasure(load,n),expected[load][n-1]);
 assert.throws(()=>centerMeasure('bad',1));assert.throws(()=>centerMeasure('small',0));
});
test('completion requires both comparisons and the limitation; saved records cannot claim impossible allocations',()=>{
 let q=centerCreate();q.load='large';q.servers=1;assert.equal(centerRun(q).feasible,false);assert.equal(q.trials['large:1'],false);
 for(const [load,servers] of [['small',1],['small',4],['large',2],['large',4]]){q.load=load;q.servers=servers;centerRun(q);q=centerRestore(q);}
 assert.equal(centerComplete(q),false);q.answer='assumptions';assert.equal(centerComplete(q),true);const copy=centerRestore(q);copy.trials['small:1']=false;assert.equal(centerComplete(q),true);assert.equal(centerComplete(copy),false);
 const bad=structuredClone(q);bad.trials['large:1']=true;assert.throws(()=>centerRestore(bad));
});
