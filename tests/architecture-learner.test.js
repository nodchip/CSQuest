import test from 'node:test';
import assert from 'node:assert/strict';
import {archTrain,archTest,archThresholds,archMeasures,archBest,archFit,archEvaluate,archLearnCreate,archLearnRestore,archLearnComplete} from '../src/architecture-learner.js';
test('the trained decision stump minimizes training errors for each objective and exposes the held-out failure',()=>{
 for(const [goal,threshold] of [['time',2.5],['energy',3.5]]){const fit=archFit(goal),ev=archEvaluate(goal);assert.equal(fit.threshold,threshold);assert.equal(fit.correct,6);assert.equal(fit.scores.length,archThresholds.length);assert.equal(Math.max(...fit.scores.map(x=>x.correct)),6);assert.equal(ev.correct,3);assert.equal(ev.rows[3].prediction,'special');assert.equal(ev.rows[3].actual,'general');}
 assert.equal(archBest(archTrain[2],'time'),'special');assert.equal(archBest(archTrain[2],'energy'),'general');assert.equal(archMeasures(archTest[3]).intensity,4);
 assert.throws(()=>archMeasures({ops:1,bytes:0}));assert.throws(()=>archFit('missing'));
});
test('drafts validate and both objectives and reflections are required',()=>{
 const q=archLearnCreate();q.stages.time=1;assert.deepEqual(archLearnRestore(q),q);assert.throws(()=>archLearnRestore({...q,stages:{time:3,energy:0}}));q.stages={time:2,energy:2};q.generalization='holdout';assert.equal(archLearnComplete(q),false);q.tradeoff='objective';assert.equal(archLearnComplete(q),true);
});
