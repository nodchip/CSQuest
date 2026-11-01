import test from 'node:test';
import assert from 'node:assert/strict';
import {coveringCases,coveringResult,createCoveringIndex,coveringComplete,restoreCoveringIndex} from '../src/covering-index.js';

test('payload and visibility determine which distinct heap pages must be visited',()=>{
  const expected={baseVisible:['P1','P2'],basePartial:['P1','P2'],coverVisible:[],coverPartial:['P2']};
  for(const [id,pages] of Object.entries(expected)){const result=coveringResult(id);assert.deepEqual(result.heapPages,pages);assert.deepEqual(result.names,['月草','星草','風草']);}
  assert.throws(()=>coveringResult('unknown'));assert.throws(()=>coveringResult('__proto__'));
});
test('four checked estimates and restored independent choices are required',()=>{
  const s=createCoveringIndex();for(const [id,pages] of Object.entries({baseVisible:2,basePartial:2,coverVisible:0,coverPartial:1}))s.choices[id]={pages,checked:true};assert.equal(coveringComplete(s),true);
  for(const id of Object.keys(coveringCases)){const changed=structuredClone(s);changed.choices[id].checked=false;assert.equal(coveringComplete(changed),false);}
  const copy=restoreCoveringIndex(s);copy.choices.coverVisible.pages=2;assert.equal(coveringComplete(copy),false);assert.equal(s.choices.coverVisible.pages,0);assert.throws(()=>restoreCoveringIndex({...s,choices:{...s.choices,coverPartial:{pages:3,checked:true}}}));
});
