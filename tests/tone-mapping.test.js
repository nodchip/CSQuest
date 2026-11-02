import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {toneInputs,toneExposures,toneMethods,toneLinear,toneEncode,toneValues,toneCreate,toneObserve,toneComplete,toneRestore} from '../src/tone-mapping.js';

test('linear clipping, compression and sRGB encoding agree with reference values',()=>{
  assert.equal(toneLinear(4,1,'clip'),1);
  assert.equal(toneLinear(4,1,'compress'),0.8);
  assert.equal(toneEncode(0),0);assert.equal(toneEncode(1),255);assert.equal(toneEncode(0.5),188);
  assert.deepEqual(toneValues(1,'clip').slice(2),[255,255,255]);
  for(const e of toneExposures){const compressed=toneInputs.map(v=>toneLinear(v,e,'compress'));assert.ok(compressed.every((v,i)=>v<1&&(i===0||v>compressed[i-1])));}
  assert.throws(()=>toneLinear(-1,1,'clip'));assert.throws(()=>toneEncode(2));
});
test('all six settings and both correct conclusions are required; saved data are checked',()=>{
  const q=toneCreate();toneObserve(q);toneObserve(q);assert.deepEqual(q.seen,['1:clip']);
  for(const e of toneExposures)for(const m of Object.keys(toneMethods)){q.exposure=e;q.method=m;toneObserve(q);}
  q.clipping='same';q.reflection='perfect';assert.equal(toneComplete(q),false);
  q.reflection='tradeoff';assert.equal(toneComplete(q),true);const restored=toneRestore(q);restored.seen.pop();assert.equal(q.seen.length,6);
  assert.throws(()=>toneRestore({...q,seen:['1:clip','1:clip']}));assert.throws(()=>toneRestore({...q,exposure:2}));
});
