import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSpring,springNext,springStep,springComplete,restoreSpring} from '../src/spring-particle.js';

test('restoring force and symplectic updates produce independently calculated trajectories',()=>{
 const expected={near:[[-1,-1,0],[0,-1,-1],[1,0,-1]],far:[[-2,-2,0],[0,-2,-2],[2,0,-2]]},s=createSpring();
 for(const [id,steps] of Object.entries(expected))for(const [force,velocity,position] of steps){const trial=s.trials[id];assert.deepEqual(springNext(trial),{force,velocity,position});assert.equal(springStep(trial,force===2?1:2,velocity,position).history.length,trial.history.length);s.trials[id]=springStep(trial,force,velocity,position);}
 assert.equal(springComplete(s),true);
});
test('saved trials replay only valid updates',()=>{
 const saved={selected:'near',histories:{near:[[-1,-1,0]],far:[]}};const s=restoreSpring(saved);assert.equal(s.trials.near.position,0);assert.equal(s.trials.near.velocity,-1);
 saved.histories.near=[[1,-1,0]];assert.throws(()=>restoreSpring(saved),RangeError);
});
