import test from 'node:test';
import assert from 'node:assert/strict';
import {analysisSteps,createAnalysisCycle,chooseAnalysisCycle,restoreAnalysisCycle,analysisCycleComplete} from '../src/analysis-cycle.js';
import {lifeSteps,restoreLife,lifeComplete} from '../src/data-life.js';
test('each scenario requires its intended decision and provides a reason for other choices',()=>{
 let s=createAnalysisCycle();for(const step of analysisSteps){for(const choice of Object.keys(step.choices).filter(x=>x!==step.correct)){const wrong=chooseAnalysisCycle(s,choice);assert.deepEqual(wrong.actions,s.actions);assert.ok(wrong.feedback);}s=chooseAnalysisCycle(s,step.correct);}assert.equal(analysisCycleComplete(s),true);assert.deepEqual(restoreAnalysisCycle(s.actions),s);assert.throws(()=>chooseAnalysisCycle(s,'goal'));assert.throws(()=>restoreAnalysisCycle(['deploy']));
});
test('legacy drafts preserve the data lifecycle and require the new analysis',()=>{
 const actions=lifeSteps.map(x=>x.correct),old=restoreLife(actions);assert.equal(lifeComplete(old),false);
 const restored=restoreLife({actions,analysis:analysisSteps.map(x=>x.correct)});assert.equal(lifeComplete(restored),true);assert.throws(()=>restoreLife({actions,analysis:['deploy']}));
});
