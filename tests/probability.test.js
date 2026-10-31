import test from 'node:test';
import assert from 'node:assert/strict';
import {scenarios,counts,options,answer,createProbability,chooseProbability,restoreProbability} from '../src/probability.js';

test('the same detection rate leads to different posterior probabilities at different base rates',()=>{
  const [v,c]=scenarios.map(counts);
  assert.equal(v.trueSignal/v.genuine,c.trueSignal/c.genuine);
  assert.deepEqual([v.trueSignal,v.signal],[8,17]);
  assert.deepEqual([c.trueSignal,c.signal],[40,45]);
  assert.equal(answer(scenarios[0],'posterior','signal'),true);
  assert.equal(answer(scenarios[0],'posterior','genuine'),false);
});
test('all three denominators represent different conditioning events',()=>{
  assert.deepEqual(options(scenarios[0],'detection').map(x=>x.label),['8 / 10','8 / 17','17 / 100']);
  assert.equal(counts(scenarios[0]).trueSilent,2);assert.equal(counts(scenarios[0]).falseSilent,81);
});
test('wrong choices do not advance and a valid partial sequence can resume',()=>{
  assert.equal(chooseProbability(createProbability(),'all').step,0);
  assert.equal(restoreProbability(['genuine','signal','genuine']).step,3);
  assert.equal(restoreProbability(['genuine','signal','genuine','signal']).step,4);
  assert.throws(()=>restoreProbability(['signal']),RangeError);
  assert.throws(()=>restoreProbability(['genuine','signal','genuine','signal','signal']),RangeError);
  assert.throws(()=>counts({genuine:1,ordinary:1,trueSignal:2,falseSignal:0}),RangeError);
});
