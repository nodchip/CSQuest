import test from 'node:test';
import assert from 'node:assert/strict';
import {equityTrainingResult,createEquityTraining,runEquityTraining,equityTrainingComplete,restoreEquityTraining} from '../src/equity-training.js';
test('the equal allocation leaves one participant short in this fixed scenario',()=>{assert.deepEqual(equityTrainingResult([2,2,2]),{used:6,ready:[true,true,false]});assert.deepEqual(equityTrainingResult([1,2,3]),{used:6,ready:[true,true,true]});assert.throws(()=>equityTrainingResult([3,2,2]));});
test('both experiments and reflection are required, with independent restored state',()=>{let s=createEquityTraining();s.allocation=[2,2,2];s=runEquityTraining(s);s.allocation=[1,2,3];s=runEquityTraining(s);s.answer='identical';s.checked=true;assert.equal(equityTrainingComplete(s),false);s.answer='barriers';assert.equal(equityTrainingComplete(s),true);const restored=restoreEquityTraining(s);restored.allocation[0]=0;assert.equal(s.allocation[0],1);});
