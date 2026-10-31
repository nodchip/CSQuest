import {test} from 'node:test';
import assert from 'node:assert/strict';
import {gateDelayState,createGateDelay,gateDelayComplete,restoreGateDelay} from '../src/gate-delay.js';
test('one unit per inverter propagates the input change through three stages',()=>{assert.deepEqual([0,1,2,3].map(t=>gateDelayState(t).outputs),[[1,0,1],[0,0,1],[0,1,1],[0,1,0]]);assert.equal(gateDelayState(2).settled,false);assert.equal(gateDelayState(3).settled,true);assert.throws(()=>gateDelayState(4),RangeError);});
test('early and settled captures are both necessary and restoration rejects future captures',()=>{const s=createGateDelay();s.tick=3;s.captures=[2,3];const copy=restoreGateDelay(s);s.captures.pop();assert.equal(gateDelayComplete(s),false);assert.equal(gateDelayComplete(copy),true);assert.throws(()=>restoreGateDelay({tick:1,captures:[2]}),RangeError);});
