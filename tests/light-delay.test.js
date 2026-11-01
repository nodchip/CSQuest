import {test} from 'node:test';
import assert from 'node:assert/strict';
import {lightSpeed,lightCases,lightNanoseconds,createLightDelay,lightTrialCorrect,lightComplete,restoreLightDelay} from '../src/light-delay.js';
import {restoreCache} from '../src/cache.js';
test('vacuum propagation times match the SI speed and nearest approximate GHz cycle count',()=>{
 assert.equal(lightSpeed,299792458);
 for(const c of Object.values(lightCases)){const ns=c.metres*1e9/299792458;assert.ok(Math.abs(lightNanoseconds(c.metres)-ns)<1e-12);assert.ok(Math.abs(ns-c.cycles)/c.cycles<0.001);}
 assert.throws(()=>lightNanoseconds(-1),RangeError);assert.throws(()=>lightNanoseconds(Infinity),RangeError);
});
test('three checked distances and the clock comparison are required and drafts validate',()=>{
 const s=createLightDelay();for(const [id,c] of Object.entries(lightCases)){s.choices[id]=c.cycles;s.checked[id]=true;assert.equal(lightTrialCorrect(s,id),true);}s.answer='twice';s.confirmed=true;assert.equal(lightComplete(s),true);const copy=restoreLightDelay(s);s.choices.near=100;assert.equal(lightComplete(s),false);assert.equal(lightComplete(copy),true);assert.throws(()=>restoreLightDelay({...copy,answer:'bad'}),RangeError);
 const old=restoreCache({selected:'grouped',index:{grouped:1,rotating:0}});assert.deepEqual(old.light,createLightDelay());
});
