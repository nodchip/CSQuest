import test from 'node:test';
import assert from 'node:assert/strict';
import {graphReductionCases,graphReductionReplay,graphReductionCreate,graphReductionStep,graphReductionCheck,graphReductionComplete,graphReductionRestore} from '../src/graph-reduction.js';

test('shared references update together, while separate nodes require two reductions',()=>{
 const shared=graphReductionReplay('shared',['A']);assert.deepEqual(shared.refs,['A','A']);assert.deepEqual(shared.refs.map(k=>shared.nodes[k]),[3,3]);assert.equal(graphReductionReplay('shared',['A','root']).calculations,1);
 for(const h of [['A','B','root'],['B','A','root']]){const state=graphReductionReplay('copied',h);assert.equal(state.calculations,2);assert.equal(state.output,6);}assert.equal(graphReductionReplay('unused',['root']).calculations,0);assert.throws(()=>graphReductionReplay('shared',['root']));assert.throws(()=>graphReductionReplay('shared',['B']));assert.throws(()=>graphReductionReplay('shared',['A','A']));
});
test('unnecessary evaluation cannot count as the needed-only observation',()=>{
 const s=graphReductionCreate();s.selected='unused';for(const node of ['A','root']){s.node=node;assert.ok(graphReductionStep(s).ok);}s.trials.unused.prediction=1;assert.equal(graphReductionCheck(s).ok,false);assert.equal(graphReductionComplete(s),false);
});
test('all scenarios, observed counts, reflection and valid saved histories are required',()=>{
 const s=graphReductionCreate();for(const [id,history] of Object.entries({shared:['A','root'],copied:['B','A','root'],unused:['root']})){s.selected=id;for(const node of history){s.node=node;assert.ok(graphReductionStep(s).ok);}s.trials[id].prediction=graphReductionCases[id].expected;assert.ok(graphReductionCheck(s).ok);}s.answer='sharing';s.checked=true;assert.ok(graphReductionComplete(s));const copy=graphReductionRestore(s);copy.trials.shared.history.pop();assert.equal(s.trials.shared.history.length,2);assert.throws(()=>graphReductionRestore({...s,trials:{...s.trials,shared:{history:['root'],prediction:0,checked:true}}}));
});
