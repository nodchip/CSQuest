import test from 'node:test';
import assert from 'node:assert/strict';
import {modalOptions,modalResults,modalShortfall,createMultimodal,multimodalComplete,restoreMultimodal} from '../src/multimodal-tradeoff.js';
test('no three options cover the stated scenarios and all four do',()=>{const keys=Object.keys(modalOptions);for(let mask=0;mask<16;mask++){const chosen=keys.filter((_,i)=>mask&(1<<i)),all=Object.values(modalResults(chosen)).every(r=>r.input&&r.output);assert.equal(all,mask===15);}assert.ok(modalShortfall(['touch','screen','audio'],3));});
test('a tested shortfall and a feasible revised design are both needed',()=>{const s=createMultimodal();Object.assign(s,{chosen:Object.keys(modalOptions),budget:4,shortfall:true,tested:true,answer:'tradeoff',checked:true});assert.ok(multimodalComplete(s));assert.deepEqual(restoreMultimodal(s),s);assert.throws(()=>restoreMultimodal({...s,shortfall:false}));assert.throws(()=>restoreMultimodal({...s,budget:3,tested:true}));});
