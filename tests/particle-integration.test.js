import {test} from 'node:test';
import assert from 'node:assert/strict';
import {particleTrials,createParticle,particleNext,particleStep,particleComplete,restoreParticle} from '../src/particle-integration.js';

test('constant acceleration produces known traces for each time step and update order',()=>{
 const expected={explicit1:[0,2],semi1:[2,6],explicitHalf:[0,.5,1.5,3],semiHalf:[.5,1.5,3,5]},s=createParticle();
 for(const [id,c] of Object.entries(particleTrials)){for(const [index,position] of expected[id].entries()){const trial=s.trials[id],next=particleNext(trial);assert.equal(next.position,position);assert.equal(next.velocity,2*(index+1)*c.dt);assert.equal(particleStep(trial,6,0).history.length,trial.history.length);s.trials[id]=particleStep(trial,position,next.velocity);}assert.equal(s.trials[id].time,2);}
 assert.equal(particleComplete(s),true);assert.deepEqual(Object.fromEntries(Object.entries(s.trials).map(([id,t])=>[id,t.position])),{explicit1:2,semi1:6,explicitHalf:3,semiHalf:5});
});
test('drafts replay predictions and reject altered or excessive histories',()=>{
 const s=restoreParticle({selected:'semi1',histories:{explicit1:[],semi1:[[2,2]],explicitHalf:[],semiHalf:[]}});assert.equal(s.trials.semi1.position,2);
 assert.throws(()=>restoreParticle({selected:'semi1',histories:{explicit1:[],semi1:[[0,2]],explicitHalf:[],semiHalf:[]}}),RangeError);
});
