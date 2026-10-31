import test from 'node:test';
import assert from 'node:assert/strict';
import {translationPlans,createTranslation,translationStep,translationComplete,restoreTranslation} from '../src/translation-workshop.js';
test('changed source affects interpretation immediately but requires rebuilding the artifact',()=>{
 const s=createTranslation(),sequences={interpret:[['run',3],['edit',3],['run',4]],compile:[['build',3],['run',3],['edit',3],['run',3],['build',3],['run',4]]};
 for(const [mode,actions] of Object.entries(sequences)){let t=s.trials[mode];assert.equal(translationStep(t,'edit',3).step,0);for(const [action,guess] of actions){if(action==='run'){const wrong=guess===3?4:3;assert.equal(translationStep(t,action,wrong).step,t.step);}t=translationStep(t,action,guess);}s.trials[mode]=t;assert.equal(t.step,translationPlans[mode].length);}
 assert.deepEqual(s.trials.interpret.runs,[3,4]);assert.deepEqual(s.trials.compile.runs,[3,3,4]);s.reason='automatic';s.checked=true;assert.equal(translationComplete(s),false);s.reason='rebuild';assert.equal(translationComplete(s),true);assert.deepEqual(restoreTranslation(s),s);
});
test('restore replays and rejects altered or out-of-order actions',()=>{
 const s=createTranslation();s.trials.compile=translationStep(s.trials.compile,'build',3);const copy=restoreTranslation(s);copy.trials.compile.history[0][0]='run';assert.equal(s.trials.compile.history[0][0],'build');assert.throws(()=>restoreTranslation(copy));
});
