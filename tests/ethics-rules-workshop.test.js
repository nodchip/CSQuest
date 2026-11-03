import test from 'node:test';
import assert from 'node:assert/strict';
import {ethicsRulesCases,ethicsRulesLaws,ethicsRulesActions,ethicsRulesCreate,ethicsRulesTrialDone,ethicsRulesDone,ethicsRulesRestore} from '../src/ethics-rules-workshop.js';

test('each scenario requires its evidence, stated rule and next action',()=>{
 const expected={allowed:['allowed','reduce'],forbidden:['forbidden','stop'],unknown:['unknown','verify']};
 for(const [id,[law,action]] of Object.entries(expected))for(const l of Object.keys(ethicsRulesLaws))for(const a of Object.keys(ethicsRulesActions)){
  const t={seen:['rule','custom','impact'],law:l,action:a,checked:true};assert.equal(ethicsRulesTrialDone(id,t),l===law&&a===action);
  assert.equal(ethicsRulesTrialDone(id,{...t,seen:['rule','custom']}),false);
 }
 assert.deepEqual(Object.keys(ethicsRulesCases),Object.keys(expected));
});
test('completion and restoration require all cases and copy evidence',()=>{
 const q=ethicsRulesCreate();for(const [id,c] of Object.entries(ethicsRulesCases))q.trials[id]={seen:['rule','custom','impact'],law:c.law,action:c.action,checked:true};
 q.answer='distinct';assert.equal(ethicsRulesDone(q),false);q.answerChecked=true;assert.equal(ethicsRulesDone(q),true);
 const copy=ethicsRulesRestore(q);copy.trials.allowed.seen.pop();assert.equal(q.trials.allowed.seen.length,3);
 q.trials.unknown.seen.push('rule');assert.throws(()=>ethicsRulesRestore(q));
});
