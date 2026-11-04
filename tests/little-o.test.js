import test from 'node:test';
import assert from 'node:assert/strict';
import {littleRatio,littleDenominators,littleThreshold,createLittle,restoreLittle,littleComplete} from '../src/little-o.js';
test('a strict quarter comparison treats equality differently from less than',()=>{assert.deepEqual(littleRatio('linear',4),{numerator:4,denominator:16,below:false});assert.deepEqual(littleRatio('linear',8),{numerator:8,denominator:64,below:true});assert.equal(littleRatio('square',4).below,false);assert.equal(littleRatio('square',8).below,false);assert.throws(()=>littleRatio('linear',0));});
test('all four checked predictions and limit interpretation are required',()=>{const s=createLittle();for(const id of ['linear','square'])for(const n of [4,8])s.trials[id][n]={guess:littleRatio(id,n).below,checked:true};s.answer='limit';s.checked=true;assert.equal(littleComplete(s),true);const copy=restoreLittle(s);copy.trials.linear[4].guess=true;assert.equal(littleComplete(copy),false);assert.equal(littleComplete(s),true);assert.throws(()=>restoreLittle({...s,size:16}));});
test('strict threshold starts one integer beyond each chosen denominator',()=>{
 for(const k of littleDenominators){const {start}=littleThreshold(k);assert.equal(start,k+1);assert.ok(!(1/k<1/k));for(let n=start;n<100;n++)assert.ok(1/n<1/k);}
 assert.throws(()=>littleThreshold(0));const old=createLittle();delete old.denominator;assert.equal(restoreLittle(old).denominator,4);assert.equal(restoreLittle({...old,denominator:16}).denominator,16);assert.throws(()=>restoreLittle({...old,denominator:3}));
});
