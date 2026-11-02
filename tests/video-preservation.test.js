import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {videoOriginal,videoCases,videoCreate,videoCheck,videoComplete,videoRestore} from '../src/video-preservation.js';

test('fixed examples distinguish sampling, exact copy, requantization and loss',()=>{
  const digital=videoOriginal.map(Math.round);
  assert.deepEqual(videoCases.exact.before,digital);
  assert.deepEqual(videoCases.exact.after,digital);
  assert.deepEqual(videoCases.transcode.after,digital.map(v=>Math.round(v/2)*2));
  assert.equal(videoCases.damage.after[2],null);
  assert.ok(videoCases.analog.after.every((v,i)=>v!==videoOriginal[i]));
});
test('incorrect predictions do not advance; all cases and reflection are needed',()=>{
  const q=videoCreate();q.answer='same';videoCheck(q);assert.deepEqual(q.seen,[]);
  for(const [id,c] of Object.entries(videoCases)){q.scenario=id;q.answer=c.answer;videoCheck(q);}
  assert.equal(videoComplete(q),false);q.reflection='stages';assert.equal(videoComplete(q),true);
  const restored=videoRestore(q);restored.seen.pop();assert.equal(q.seen.length,4);
  assert.throws(()=>videoRestore({...q,checked:{...q.checked,correct:false}}));
});
