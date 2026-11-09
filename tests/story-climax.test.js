import test from 'node:test';
import assert from 'node:assert/strict';
import {climaxSteps,validClimaxHistory,tryClimaxAction,climaxComplete} from '../src/story-climax.js';

test('each correct action progresses, an error leaves the state unchanged',()=>{
 let history=[];
 for(const step of climaxSteps){
  const wrong=step.choices.find(([id])=>id!==step.answer);
  if(wrong)assert.deepEqual(tryClimaxAction(history,wrong[0]),{history,accepted:false});
  history=tryClimaxAction(history,step.answer).history;
  assert.equal(validClimaxHistory(history),true);
 }
 assert.equal(climaxComplete(history),true);
 assert.equal(climaxComplete(history.slice(0,-1)),false);
 assert.equal(validClimaxHistory([...history.slice(0,-1),'announce']),false);
});
