import test from 'node:test';
import assert from 'node:assert/strict';
import {baseRateTable,baseRateAct,createBaseRate,restoreBaseRate,baseRateComplete} from '../src/base-rate.js';
const act=(s,a)=>{const r=baseRateAct(s,a);assert.equal(r.ok,true,r.message);return r.state;};
test('frequency tables preserve totals and yield the expected posterior fractions',()=>{
 const rare=baseRateTable('rare'),common=baseRateTable('common');
 assert.deepEqual([rare.tp,rare.fn,rare.fp,rare.tn],[9,1,99,891]);
 assert.deepEqual([common.tp,common.fn,common.fp,common.tn],[450,50,50,450]);
 for(const t of [rare,common]){assert.equal(t.tp+t.fn,t.fault);assert.equal(t.fp+t.tn,t.healthy);assert.equal(t.alarm+t.silent,1000);assert.equal(t.tp/t.fault,.9);assert.equal(t.fp/t.healthy,.1);}
 assert.equal(rare.tp/rare.alarm,1/12);assert.equal(common.tp/common.alarm,.9);
 assert.throws(()=>baseRateTable('unknown'),RangeError);
});
test('checking the conditional counts requires matching observed group and target',()=>{
 for(const village of ['rare','common'])for(const signal of ['alarm','silent'])for(const numerator of ['tp','fn','fp','tn'])for(const denominator of ['alarm','silent','fault','healthy']){
  let s=createBaseRate();for(const a of [`village:${village}`,`signal:${signal}`,`num:${numerator}`,`den:${denominator}`,'calculate'])s=act(s,a);
  assert.equal(s.report.correct,numerator===(signal==='alarm'?'tp':'fn')&&denominator===signal);
 }
});
test('four observations and the correct interpretation are required; progress replays',()=>{
 let s=createBaseRate();assert.equal(baseRateAct(s,'calculate').ok,false);
 for(const village of ['rare','common'])for(const signal of ['alarm','silent'])for(const a of [`village:${village}`,`signal:${signal}`,`num:${signal==='alarm'?'tp':'fn'}`,`den:${signal}`,'calculate'])s=act(s,a);
 for(const a of ['answer:same','check'])s=act(s,a);assert.equal(baseRateComplete(s),false);
 for(const a of ['answer:prior','check'])s=act(s,a);assert.equal(baseRateComplete(s),true);
 assert.deepEqual(restoreBaseRate(JSON.parse(JSON.stringify(s))),s);assert.throws(()=>restoreBaseRate({history:['calculate']}),RangeError);
});
