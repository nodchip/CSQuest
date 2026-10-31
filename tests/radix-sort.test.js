import test from 'node:test';
import assert from 'node:assert/strict';
import {radixCases,createRadixTrial,stepRadix,createRadixSet,radixComplete,restoreRadixSet} from '../src/radix-sort.js';

test('stable low-digit then high-digit distribution orders both examples',()=>{
  const all=createRadixSet();for(const [id,data] of Object.entries(radixCases)){let s=createRadixTrial(id);while(s.pass!=='done'){if(s.cursor===s.source.length)s=stepRadix(s,'gather');else{const v=s.source[s.cursor].value,digit=s.pass==='ones'?v%10:Math.floor(v/10);s=stepRadix(s,`bucket:${digit}`);}}assert.deepEqual(s.source,data.items.slice().sort((a,b)=>a.value-b.value));all.trials[id]=s;}assert.ok(radixComplete(all));assert.deepEqual(all.trials.first.source.filter(x=>x.value===11).map(x=>x.id),['B','E']);
});
test('wrong digit and premature collection do not advance; saved steps replay',()=>{
  let s=createRadixTrial('first');assert.equal(stepRadix(s,'bucket:2').history.length,0);assert.equal(stepRadix(s,'gather').history.length,0);s=stepRadix(s,'bucket:1');const histories={first:s.history,second:[]};assert.equal(restoreRadixSet({selected:'first',histories}).trials.first.buckets[1][0].id,'A');assert.throws(()=>restoreRadixSet({selected:'first',histories:{...histories,first:['bucket:2']}}));
});
