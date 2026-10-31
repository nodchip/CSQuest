import {test} from 'node:test';
import assert from 'node:assert/strict';
import {clockMemoryRun,clockMemoryComplete,restoreClockMemory} from '../src/clocked-memory.js';
test('input changes preserve output until an edge captures the input',()=>{
 const r=clockMemoryRun(['one','clock','zero','clock']);assert.deepEqual(r.events.map(e=>[e.input,e.output]),[[1,0],[1,1],[0,1],[0,0]]);assert.equal(r.stage,4);
 assert.equal(clockMemoryRun(['one','zero','clock']).output,0);assert.throws(()=>clockMemoryRun(['other']),RangeError);
});
test('the two captures and intervening changes are required, including after restoration',()=>{
 const s={history:['one','clock','zero']},copy=restoreClockMemory(s);assert.equal(clockMemoryComplete(copy),false);s.history.push('clock');assert.equal(clockMemoryComplete(s),true);assert.equal(copy.history.length,3);assert.throws(()=>restoreClockMemory({history:Array(41).fill('clock')}),RangeError);
});
