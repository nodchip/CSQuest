import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {samplingFrequencies,samplingRates,samplingValue,samplingValues,samplingCreate,samplingObserve,samplingComplete,samplingRestore} from '../src/temporal-sampling.js';

test('different frequencies coincide at four samples but not at eight or twelve',()=>{
  assert.deepEqual(samplingValues(1,4),[5,10,5,0]);
  assert.deepEqual(samplingValues(5,4),samplingValues(1,4));
  for(const rate of [8,12])assert.notDeepEqual(samplingValues(5,rate),samplingValues(1,rate));
  assert.equal(samplingValues(1,12).length,12);
  assert.throws(()=>samplingValues(1,0));assert.throws(()=>samplingValue(2,0));
});
test('all six observations and both comparisons are needed and drafts restore',()=>{
  const q=samplingCreate();samplingObserve(q);samplingObserve(q);assert.deepEqual(q.seen,['1:4']);
  let restored=samplingRestore(q);restored.seen.pop();assert.equal(q.seen.length,1);
  for(const f of samplingFrequencies)for(const r of samplingRates){q.frequency=f;q.rate=r;samplingObserve(q);}
  q.comparison='same4';q.rateAnswer='eight';assert.equal(samplingComplete(q),false);
  q.rateAnswer='twelve';assert.equal(samplingComplete(q),true);restored=samplingRestore(q);assert.ok(samplingComplete(restored));
  assert.throws(()=>samplingRestore({...q,seen:['5:4','5:4']}));
  assert.throws(()=>samplingRestore({...q,seen:['5:6']}));
});
