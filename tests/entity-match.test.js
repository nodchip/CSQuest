import test from 'node:test';
import assert from 'node:assert/strict';
import {entityCases,entityActions,createEntityMatch,restoreEntityMatch,entityCorrect,entityComplete} from '../src/entity-match.js';
test('confirmed equal IDs, distinct IDs and absent IDs require three different decisions',()=>{
 const cases=Object.values(entityCases);assert.equal(cases[0].first.id,cases[0].second.id);assert.notEqual(cases[1].first.id,cases[1].second.id);assert.equal(cases[1].first.name,cases[1].second.name);assert.equal(cases[2].first.id,null);assert.deepEqual(cases.map(c=>c.expected),['merge','separate','review']);
 for(const [id,item] of Object.entries(entityCases))for(const answer of Object.keys(entityActions))assert.equal(entityCorrect(id,{answer,checked:true}),answer===item.expected);
});
test('completion requires all checked decisions; restores validate and copy',()=>{
 const s=createEntityMatch();for(const [id,item] of Object.entries(entityCases))s.choices[id]={answer:item.expected,checked:true};assert.equal(entityComplete(s),true);const copy=restoreEntityMatch(s);s.choices.same.answer='review';assert.equal(entityComplete(s),false);assert.equal(copy.choices.same.answer,'merge');copy.choices.unknown.answer='invalid';assert.throws(()=>restoreEntityMatch(copy),RangeError);
});
