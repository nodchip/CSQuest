import {test} from 'node:test';
import assert from 'node:assert/strict';
import {intrusionEvaluate,createIntrusion,intrusionComplete,restoreIntrusion} from '../src/intrusion-threshold.js';
test('fixed thresholds produce the expected false alarms and missed attacks',()=>{assert.deepEqual([3,4,6].map(n=>{const r=intrusionEvaluate(n);return [r.fp,r.fn];}),[[2,0],[2,1],[0,2]]);assert.throws(()=>intrusionEvaluate(5),RangeError);});
test('all thresholds and both checked counts are required; restoration is independent',()=>{const s=createIntrusion();s.seen=[4,3,6];s.fp=2;s.fn=1;s.checked=true;const copy=restoreIntrusion(s);s.seen.pop();assert.equal(intrusionComplete(s),false);assert.equal(intrusionComplete(copy),true);assert.throws(()=>restoreIntrusion({...copy,seen:[3,6]}),RangeError);});
