import test from 'node:test';
import assert from 'node:assert/strict';
import {spikeFrame,spikeCreate,spikeAdvance,spikeRestore,spikeComplete} from '../src/spike-lantern.js';
test('all four-tick binary signals agree with independent fixed-point threshold calculation',()=>{
 for(let mask=0;mask<16;mask++)for(const mode of ['leak','hold']){
  const pattern=Array.from({length:4},(_,i)=>(mask>>i)&1);let units=0;
  const r=spikeFrame(pattern,mode,4);
  for(let i=0;i<4;i++){units=(mode==='leak'?units/2:units)+16*pattern[i];const fire=units>=24;assert.equal(r.history[i].before,units/16);assert.equal(r.history[i].fired,fire);if(fire)units=0;assert.equal(r.history[i].after,units/16);}
 }
 assert.equal(spikeFrame([1,1,0,0],'leak',4).spikes,1);assert.equal(spikeFrame([1,0,0,1],'leak',4).spikes,0);assert.equal(spikeFrame([1,0,0,1],'hold',4).spikes,1);
});
test('observations are recorded on the fourth tick, restored and required for completion',()=>{
 const q=spikeCreate();spikeAdvance(q);assert.deepEqual(spikeRestore(q),q);assert.throws(()=>spikeRestore({...q,observed:['leak:2222']}));
 for(const mode of ['leak','hold'])for(const pattern of [[1,1,0,0],[1,0,0,1]]){q.mode=mode;q.pattern=pattern;q.ticks=0;for(let i=0;i<4;i++)spikeAdvance(q);assert.throws(()=>spikeAdvance(q));}
 assert.equal(spikeComplete(q),false);q.answer='timing';assert.equal(spikeComplete(q),true);
});
