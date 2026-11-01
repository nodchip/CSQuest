import test from 'node:test';
import assert from 'node:assert/strict';
import {modelViewOffsets,modelViewRequired,modelViewScene,createModelViewMotion,modelViewMotionComplete,restoreModelViewMotion} from '../src/model-view-motion.js';
test('world and view coordinates agree for all selectable movements',()=>{
 for(const a of modelViewOffsets)for(const b of modelViewOffsets)for(const c of modelViewOffsets){const r=modelViewScene(a,b,c);assert.deepEqual(r.world,{crystal:4+a,tower:7+b,camera:c});assert.deepEqual(r.view,{crystal:4+a-c,tower:7+b-c});}
 assert.deepEqual(modelViewScene(-2,-2,0).view,modelViewScene(0,0,2).view);assert.notDeepEqual(modelViewScene(-2,0,0).view,modelViewScene(0,0,2).view);assert.throws(()=>modelViewScene(1,0,0));
});
test('required comparisons and qualified conclusion survive restoration',()=>{
 const s=createModelViewMotion();s.observed=[...modelViewRequired];s.answers={match:'world',landmark:'different'};s.reflection='relative';s.checked=true;assert.ok(modelViewMotionComplete(s));assert.deepEqual(restoreModelViewMotion(s),s);s.observed.pop();assert.equal(modelViewMotionComplete(s),false);assert.throws(()=>restoreModelViewMotion({...s,observed:['0,0,0','0,0,0']}));
});
