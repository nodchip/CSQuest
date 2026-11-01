import test from 'node:test';
import assert from 'node:assert/strict';
import {rescueCases,rescueThresholds,rescueImage,rescueCreate,rescueCorrect,rescueComplete,rescueRestore} from '../src/emblem-rescue.js';
test('threshold and ordered morphology solve two distinct emblem puzzles',()=>{
 for(const threshold of [2,3,4]){assert.deepEqual(rescueImage('noise',threshold,['erode','dilate']),rescueCases.noise.target);assert.deepEqual(rescueImage('hole',threshold,['dilate','erode']),rescueCases.hole.target);assert.notDeepEqual(rescueImage('noise',threshold,['dilate','erode']),rescueCases.noise.target);assert.notDeepEqual(rescueImage('hole',threshold,['erode','dilate']),rescueCases.hole.target);}for(const id of Object.keys(rescueCases))assert.notDeepEqual(rescueImage(id,5,['erode','dilate']),rescueCases[id].target);
 for(const id of Object.keys(rescueCases))for(const th of rescueThresholds)for(const a of ['erode','dilate'])for(const b of ['erode','dilate'])for(const c of ['erode','dilate'])assert.ok(rescueImage(id,th,[a,b,c]).flat().every(v=>v===0||v===1));
});
test('checked target required and drafts validate histories',()=>{
 const s=rescueCreate();s.trials.noise={threshold:2,started:true,history:['erode','dilate'],checked:true};assert.equal(rescueCorrect('noise',s.trials.noise),true);assert.equal(rescueComplete(s),false);s.trials.hole={threshold:2,started:true,history:['dilate','erode'],checked:true};assert.equal(rescueComplete(s),true);const copy=rescueRestore(s);copy.trials.noise.history.pop();assert.equal(rescueComplete(copy),false);assert.equal(rescueComplete(s),true);s.trials.noise.history=['bad'];assert.throws(()=>rescueRestore(s));
});
