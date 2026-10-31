import {test} from 'node:test';
import assert from 'node:assert/strict';
import {effectsChoices,runEffects,effectsCorrect,createEffects,effectsComplete,restoreEffects} from '../src/write-effects.js';

test('overwritten value remains the same but removing an announcement changes the observable result',()=>{
 for(const id of ['quiet','signal'])for(const choice of Object.keys(effectsChoices))assert.equal(runEffects(id,choice).value,3);
 assert.equal(runEffects('signal','keep').signals,1);assert.equal(runEffects('signal','remove').signals,0);assert.equal(runEffects('signal','signalOnly').signals,1);
 assert.equal(effectsCorrect('quiet','remove'),true);assert.equal(effectsCorrect('quiet','signalOnly'),false);assert.equal(effectsCorrect('signal','remove'),false);assert.equal(effectsCorrect('signal','signalOnly'),true);assert.equal(effectsCorrect('signal','keep'),false);
});
test('both checked comparisons and validated, copied drafts are required',()=>{
 const s=createEffects();s.trials.quiet={choice:'remove',checked:true};s.trials.signal={choice:'signalOnly',checked:true};const restored=restoreEffects(s);assert.equal(effectsComplete(restored),true);s.trials.signal.choice='remove';assert.equal(effectsComplete(restored),true);assert.throws(()=>restoreEffects(s),RangeError);
});
