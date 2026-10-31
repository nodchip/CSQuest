import test from 'node:test';
import assert from 'node:assert/strict';
import {availabilityCases,missionOutcome,availabilitySummary,createAvailability,restoreAvailability,availabilityComplete} from '../src/availability.js';

test('the recorded uptime and every four-tick mission match independently enumerated windows',()=>{
 const expected={frequent:['interrupted','interrupted','interrupted','unavailable','interrupted','interrupted','interrupted','unavailable','interrupted'],long:['success','success','success','success','success','success','interrupted','interrupted','interrupted']};
 for(const id of Object.keys(availabilityCases)){for(let start=1;start<=9;start++)assert.equal(missionOutcome(id,start).outcome,expected[id][start-1]);const summary=availabilitySummary(id);assert.equal(summary.uptime,9);assert.equal(summary.total,12);assert.equal(summary.eligible,id==='frequent'?7:9);assert.equal(summary.success,id==='frequent'?0:6);}
 assert.throws(()=>missionOutcome('frequent',10),RangeError);
});
test('both sets of starting times are needed and saved selections are validated',()=>{
 const set=createAvailability();for(const trial of Object.values(set.trials)){trial.visited=[1,2,3,4,5,6,7,8,9];trial.current=9;}assert.equal(availabilityComplete(set),true);const restored=restoreAvailability(set);set.trials.frequent.visited.pop();assert.equal(restored.trials.frequent.visited.length,9);assert.throws(()=>restoreAvailability({...restored,trials:{...restored.trials,long:{visited:[1,1],current:1}}}),RangeError);assert.throws(()=>restoreAvailability({...restored,trials:{...restored.trials,long:{visited:[1],current:2}}}),RangeError);
});
