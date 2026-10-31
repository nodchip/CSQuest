import {test} from 'node:test';
import assert from 'node:assert/strict';
import {thresholdResult,createThreshold,thresholdComplete,restoreThreshold} from '../src/threshold-segmentation.js';
test('thresholds partition all pixels and produce the independently counted confusion matrix',()=>{
 const expected={1:[4,3,0,9],2:[3,1,1,11],3:[1,0,3,12]};for(const t of [1,2,3]){const r=thresholdResult(t);assert.deepEqual([r.tp,r.fp,r.fn,r.tn],expected[t]);assert.equal(r.tp+r.fp+r.fn+r.tn,16);assert.equal(r.errors,r.fp+r.fn);}assert.throws(()=>thresholdResult(4),RangeError);
});
test('completion requires every observation and the minimum error choice; saved records are copied',()=>{
 const s=createThreshold();for(const t of [1,2,3])s.tested[t]=true;s.choice=2;s.checked=true;const copy=restoreThreshold(s);assert.equal(thresholdComplete(copy),true);s.tested[1]=false;assert.equal(thresholdComplete(copy),true);assert.equal(thresholdComplete(s),false);copy.choice=1;assert.equal(thresholdComplete(copy),false);assert.throws(()=>restoreThreshold({...copy,selected:9}),RangeError);
});
