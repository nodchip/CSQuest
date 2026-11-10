import test from 'node:test';
import assert from 'node:assert/strict';
import {replayCpu} from '../src/endgame-cpu.js';
const cycle=['fetch','decode','execute'];
test('fetch advances the instruction position and execute changes the value',()=>{
 let p=replayCpu('basic',['fetch']);assert.deepEqual([p.pc,p.acc,p.phase,p.irAddress],[1,0,'decode',0]);
 p=replayCpu('basic',[...cycle,...cycle,...cycle,'next',...cycle,...cycle,...cycle,'next']);assert.equal(p.done,true);assert.deepEqual(p.results.map(x=>x.output),[5,5]);
 assert.equal(replayCpu('basic',['execute']),null);
});
test('zero branch skips the addition while nonzero falls through',()=>{
 let p=replayCpu('branch',[...cycle,...cycle]);assert.equal(p.pc,3);assert.equal(p.acc,0);
 const h=[...cycle,...cycle,...cycle,'next',...cycle,...cycle,...cycle,...cycle,'next'];p=replayCpu('branch',h);assert.equal(p.done,true);assert.deepEqual(p.results.map(x=>x.output),[0,5]);
});
test('the same instructions use two different memory values',()=>{
 const h=[...cycle,...cycle,...cycle,'next',...cycle,...cycle,...cycle,'next'];const p=replayCpu('data',h);assert.deepEqual(p.results.map(x=>[x.data,x.output]),[[1,3],[4,6]]);assert.equal(p.done,true);
 assert.equal(replayCpu('data',['fetch','fetch']),null);
});
