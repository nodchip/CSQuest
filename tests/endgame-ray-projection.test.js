import test from 'node:test';
import assert from 'node:assert/strict';
import {replayRayProjection} from '../src/endgame-ray-projection.js';
test('two independent fixed examples give the expected point, residual, squared distance, and dot product',()=>{
 const a=replayRayProjection('axis',['trial:0','trial:1.5','choose:1.5']);
 assert.deepEqual(a.results[0],{id:'axis',value:1.5,point:[3,0],residual:[0,2],error:4,dot:0});
 const b=replayRayProjection('diagonal',['trial:3','trial:2','choose:2']);
 assert.deepEqual(b.results[0],{id:'diagonal',value:2,point:[2,2],residual:[1,-1],error:2,dot:0});
 assert.ok(a.done&&b.done);
});
test('requires both samples, rejects errors, validates completion and restores reset',()=>{
 for(const h of [['choose:1.5'],['trial:1.5','choose:1.5'],['trial:0','trial:0'],['trial:0','trial:1.5','choose:0'],['trial:0','trial:1.5','choose:1.5','trial:2'],['trial:01']])assert.equal(replayRayProjection('axis',h),null);
 assert.deepEqual(replayRayProjection('axis',['trial:0','reset']).trials,[]);
 const h=['trial:0','trial:1.5','choose:1.5','trial:3','trial:2','choose:2'];
 assert.equal(replayRayProjection('compare',h).done,false);
 assert.equal(replayRayProjection('compare',[...h,'answer:perpendicular']).done,true);
 assert.equal(replayRayProjection('compare',[...h,'answer:closest']),null);
});
