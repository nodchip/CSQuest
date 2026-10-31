import test from 'node:test';
import assert from 'node:assert/strict';
import {sustainYears,sustainScopes,sustainImpact,sustainAnswer,createSustainability,restoreSustainability,sustainabilityComplete} from '../src/sustainability.js';

test('fixed assumptions produce the expected totals and crossover between years 7 and 8',()=>{
  assert.deepEqual(sustainImpact('repair',5,'lifecycle'),{upfront:20,operation:60,total:80});assert.equal(sustainImpact('new',5,'lifecycle').total,100);
  assert.equal(sustainImpact('repair',10,'lifecycle').total,140);assert.equal(sustainImpact('new',10,'lifecycle').total,120);
  for(let y=0;y<=10;y++){assert.equal(sustainImpact('repair',y,'lifecycle').total<sustainImpact('new',y,'lifecycle').total,y<=7);assert.equal(sustainImpact('new',y,'operation').total<=sustainImpact('repair',y,'operation').total,true);}
});
test('all six questions must be checked and correct',()=>{
  const s=createSustainability();for(const id of Object.keys(sustainYears))for(const scope of Object.keys(sustainScopes))s.choices[id][scope]={answer:sustainAnswer(id,scope),checked:true};assert.equal(sustainabilityComplete(s),true);
  s.choices.five.lifecycle.answer='new';assert.equal(sustainabilityComplete(s),false);
});
test('restoration copies choices and rejects invalid values',()=>{
  const s=createSustainability();s.choices.one.operation={answer:'new',checked:true};const copy=restoreSustainability(s);s.choices.one.operation.answer='repair';assert.equal(copy.choices.one.operation.answer,'new');
  s.choices.one.operation.answer='invalid';assert.throws(()=>restoreSustainability(s),RangeError);assert.throws(()=>sustainImpact('new',11,'lifecycle'),RangeError);
});
