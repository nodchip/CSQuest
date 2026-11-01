import test from 'node:test';
import assert from 'node:assert/strict';
import {createRobotTopics,robotTopicsAct,restoreRobotTopics,robotTopicsComplete} from '../src/robot-topics.js';
const act=(s,a)=>{const r=robotTopicsAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
test('topic and type must match before samples can be received',()=>{
 let s=createRobotTopics();s=act(s,'publish:near');assert.deepEqual(s.queue,[]);assert.ok(s.seen.includes('topicMismatch'));
 for(const a of ['topic:scan','type:color','publish:near'])s=act(s,a);assert.deepEqual(s.queue,[]);assert.ok(s.seen.includes('typeMismatch'));
 for(const a of ['type:range','publish:near','poll'])s=act(s,a);assert.equal(s.last.value,'near');assert.ok(s.seen.includes('matched'));
});
test('bounded histories and stale observations lead to different decisions',()=>{
 let s=createRobotTopics();for(const a of ['topic:scan','publish:near','publish:clear'])s=act(s,a);
 assert.deepEqual(s.queue.map(x=>x.value),['clear']);assert.ok(s.seen.includes('drop'));
 for(const a of ['depth:2','publish:near','publish:clear','poll'])s=act(s,a);
 assert.equal(s.last.value,'near');assert.deepEqual(s.queue.map(x=>x.value),['clear']);assert.ok(s.seen.includes('depth2'));
 for(const a of ['tick','tick','move'])s=act(s,a);assert.equal(s.report.result,'stale');assert.ok(s.seen.includes('stale'));
 for(const a of ['depth:1','publish:near','poll','stop'])s=act(s,a);assert.ok(s.seen.includes('safe'));
});
test('all investigations and the correct limitation are required and replayed',()=>{
 let s=createRobotTopics();for(const a of ['publish:near','topic:scan','type:color','publish:near','type:range','publish:near','poll','publish:near','publish:clear','depth:2','publish:near','publish:clear','poll','tick','tick','move','depth:1','publish:near','poll','stop','answer:guarantee','check'])s=act(s,a);
 assert.equal(robotTopicsComplete(s),false);for(const a of ['answer:bounded','check'])s=act(s,a);assert.equal(robotTopicsComplete(s),true);
 assert.deepEqual(restoreRobotTopics(JSON.parse(JSON.stringify(s))),s);assert.throws(()=>restoreRobotTopics({history:['poll']}),RangeError);
});
