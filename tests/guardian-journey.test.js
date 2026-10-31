import test from 'node:test';
import assert from 'node:assert/strict';
import {createJourney,createJourneyTrial,journeyStep,journeyComplete,restoreJourney} from '../src/guardian-journey.js';

test('journey combines a key, movement and the exclusive light condition',()=>{
  const all=createJourney();for(const [id,actions] of Object.entries({dusk:['K','G','guard','attack','T'],dawn:['K','G','attack','T']})){let s=createJourneyTrial(id);for(const action of actions)s=journeyStep(s,action);assert.equal(s.status,'won');assert.equal(s.key,true);assert.equal(s.guardian,true);all.trials[id]=s;}assert.equal(journeyComplete(all),true);
});
test('the guardian blocks movement, wrong attacks damage, and saved steps replay',()=>{
  let s=createJourneyTrial('dusk');s=journeyStep(s,'H');s=journeyStep(s,'G');assert.equal(journeyStep(s,'T').history.length,s.history.length);s=journeyStep(s,'attack');assert.equal(s.health,1);s=journeyStep(s,'attack');assert.equal(s.guardian,true);assert.equal(journeyStep(s,'T').history.length,s.history.length);
  const histories={dusk:['K','G','guard'],dawn:[]};assert.equal(restoreJourney({selected:'dusk',histories}).trials.dusk.turn,1);assert.throws(()=>restoreJourney({selected:'dusk',histories:{...histories,dusk:['T']}}));
  let failure=createJourneyTrial('dusk');for(const a of ['K','G','attack','guard','attack'])failure=journeyStep(failure,a);assert.equal(failure.status,'lost');
});
