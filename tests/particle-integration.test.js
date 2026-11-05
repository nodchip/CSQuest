import {test} from 'node:test';
import assert from 'node:assert/strict';
import {particleTrials,createParticle,particleNext,particleStep,particleComplete,restoreParticle} from '../src/particle-integration.js';

test('constant acceleration produces known traces for each time step and update order',()=>{
 const expected={explicit1:[0,2],semi1:[2,6],explicitHalf:[0,.5,1.5,3],semiHalf:[.5,1.5,3,5],midpoint1:[1,4]},s=createParticle();
 for(const [id,c] of Object.entries(particleTrials)){for(const [index,position] of expected[id].entries()){const trial=s.trials[id],next=particleNext(trial);assert.equal(next.position,position);assert.equal(next.velocity,2*(index+1)*c.dt);assert.equal(particleStep(trial,6,0).history.length,trial.history.length);s.trials[id]=particleStep(trial,position,next.velocity);}assert.equal(s.trials[id].time,2);}
 assert.equal(particleComplete(s),true);assert.deepEqual(Object.fromEntries(Object.entries(s.trials).map(([id,t])=>[id,t.position])),{explicit1:2,semi1:6,explicitHalf:3,semiHalf:5,midpoint1:4});
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
