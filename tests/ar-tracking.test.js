import {test} from 'node:test';
import assert from 'node:assert/strict';
import {arTrackingCases,arPositions,arTrackingExpected,arTrackingCorrect,createArTracking,arTrackingComplete,restoreArTracking} from '../src/ar-tracking.js';

test('actual view and overlay use different head positions when tracking is stale',()=>{
 const expected={oneOld:{stone:3,mark:4,aligned:'no'},oneNew:{stone:3,mark:3,aligned:'yes'},twoOld:{stone:2,mark:4,aligned:'no'},twoNew:{stone:2,mark:2,aligned:'yes'}};
 for(const id of Object.keys(arTrackingCases)){assert.deepEqual(arTrackingExpected(id),expected[id]);for(const stone of arPositions)for(const mark of arPositions)for(const aligned of ['yes','no'])assert.equal(arTrackingCorrect(id,{stone,mark,aligned}),stone===expected[id].stone&&mark===expected[id].mark&&aligned===expected[id].aligned);}
});
test('completion and restored drafts require checked correct observations',()=>{
 const s=createArTracking();for(const id of Object.keys(arTrackingCases))s.trials[id]={...arTrackingExpected(id),checked:true};const copy=restoreArTracking(s);assert.equal(arTrackingComplete(copy),true);s.trials.oneOld.aligned='yes';assert.equal(arTrackingComplete(copy),true);assert.throws(()=>restoreArTracking(s),RangeError);
});
