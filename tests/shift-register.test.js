import {test} from 'node:test';
import assert from 'node:assert/strict';
import {shiftRegisterNext,shiftRegisterRun,shiftRegisterComplete,restoreShiftRegister} from '../src/shift-register.js';
test('each bit receives the previous stage value for all eight states and two inputs',()=>{
 for(let n=0;n<8;n++)for(const input of [0,1]){const old=[n>>2&1,n>>1&1,n&1],next=shiftRegisterNext(old,input);assert.deepEqual(next,[input,old[0],old[1]]);assert.deepEqual(old,[n>>2&1,n>>1&1,n&1]);}assert.throws(()=>shiftRegisterNext([0,2,0],0),RangeError);
});
test('the goal needs 101 followed by a zero shift to 010; saving replays the history',()=>{
 const s={history:['one','clock','zero','clock','one','clock']};assert.deepEqual(shiftRegisterRun(s.history).bits,[1,0,1]);assert.equal(shiftRegisterComplete(s),false);const copy=restoreShiftRegister(s);s.history.push('zero','clock');const r=shiftRegisterRun(s.history);assert.deepEqual(r.bits,[0,1,0]);assert.equal(r.events.at(-1).discarded,1);assert.equal(shiftRegisterComplete(s),true);assert.equal(copy.history.length,6);assert.throws(()=>restoreShiftRegister({history:['bad']}),RangeError);
});
