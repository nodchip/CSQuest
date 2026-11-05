import {test} from 'node:test';
import assert from 'node:assert/strict';
import {particleTrials,createParticle,particleNext,particleStep,particleComplete,restoreParticle} from '../src/particle-integration.js';

test('constant acceleration produces known traces for each time step and update order',()=>{
 const expected={explicit1:[[0,2],[2,4]],semi1:[[2,2],[6,4]],explicitHalf:[[0,1],[.5,2],[1.5,3],[3,4]],semiHalf:[[.5,1],[1.5,2],[3,3],[5,4]],midpoint1:[[1,2],[4,4]],springEuler:[[1,-1],[0,-2]],springMidpoint:[[.5,-1],[-.75,-1]],springLeapfrog:[[.5,-.75],[-.5,-.75]]},s=createParticle();
 for(const id of Object.keys(particleTrials)){for(const [position,velocity] of expected[id]){const trial=s.trials[id],next=particleNext(trial);assert.equal(next.position,position);assert.equal(next.velocity,velocity);assert.equal(particleStep(trial,6,0).history.length,trial.history.length);s.trials[id]=particleStep(trial,position,velocity);}assert.equal(s.trials[id].time,2);}
 assert.equal(particleComplete(s),true);assert.deepEqual(Object.fromEntries(Object.entries(s.trials).map(([id,t])=>[id,t.position])),{explicit1:2,semi1:6,explicitHalf:3,semiHalf:5,midpoint1:4,springEuler:0,springMidpoint:-.75,springLeapfrog:-.5});
});
test('kick-drift-kick uses the acceleration at both ends and restores',()=>{
 const saved={selected:'springLeapfrog',histories:{explicit1:[],semi1:[],explicitHalf:[],semiHalf:[],springLeapfrog:[[.5,-.75],[-.5,-.75]]}};
 const s=restoreParticle(saved);assert.equal(s.trials.springLeapfrog.position,-.5);assert.equal(s.trials.springLeapfrog.velocity,-.75);
 assert.throws(()=>restoreParticle({...saved,histories:{...saved.histories,springLeapfrog:[[.5,-1]]}}),RangeError);
});
test('spring methods use acceleration at the appropriate position and restore',()=>{
 const old={selected:'springMidpoint',histories:{explicit1:[],semi1:[],explicitHalf:[],semiHalf:[],springEuler:[[1,-1],[0,-2]],springMidpoint:[[.5,-1],[-.75,-1]]}};
 const restored=restoreParticle(old);assert.equal(restored.trials.springEuler.velocity,-2);assert.equal(restored.trials.springMidpoint.position,-.75);
 assert.throws(()=>restoreParticle({...old,histories:{...old.histories,springMidpoint:[[1,-1]]}}),RangeError);
 const exactPosition=Math.cos(2),exactVelocity=-Math.sin(2);
 assert.ok(Math.abs(-.75-exactPosition)<Math.abs(exactPosition));
 assert.ok(Math.abs(-1-exactVelocity)<Math.abs(-2-exactVelocity));
});
test('drafts replay predictions and reject altered or excessive histories',()=>{
 const s=restoreParticle({selected:'semi1',histories:{explicit1:[],semi1:[[2,2]],explicitHalf:[],semiHalf:[]}});assert.equal(s.trials.semi1.position,2);
 assert.throws(()=>restoreParticle({selected:'semi1',histories:{explicit1:[],semi1:[[0,2]],explicitHalf:[],semiHalf:[]}}),RangeError);
});
test('midpoint progress restores and old completed drafts remain complete without it',()=>{
 const old={selected:'semi1',histories:{explicit1:[[0,2],[2,4]],semi1:[[2,2],[6,4]],explicitHalf:[[0,1],[.5,2],[1.5,3],[3,4]],semiHalf:[[.5,1],[1.5,2],[3,3],[5,4]]}};
 const restored=restoreParticle(old);assert.equal(particleComplete(restored),true);assert.equal(restored.trials.midpoint1.time,0);
 const saved={...old,selected:'midpoint1',histories:{...old.histories,midpoint1:[[1,2],[4,4]]}};
 assert.equal(restoreParticle(saved).trials.midpoint1.position,4);
 assert.throws(()=>restoreParticle({...saved,histories:{...saved.histories,midpoint1:[[2,2]]}}),RangeError);
});
