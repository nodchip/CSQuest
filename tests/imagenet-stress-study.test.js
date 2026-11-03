import test from 'node:test';
import assert from 'node:assert/strict';
import {studyData,studyCreate,studyDone,studyRestore,studyRequired} from '../src/imagenet-stress-study.js';
test('the study records Table 1 means and standard deviations, not individual models',()=>{
 assert.deepEqual(Object.values(studyData.resnet),[[.759,.001],[.197,.024],[.091,.008],[.1,.007],[.607,.003],[.259,.002]]);
 assert.deepEqual(Object.values(studyData.bit),[[.862,.001],[.555,.008],[.462,.019],[.515,.008],[.723,.002],[.520,.005]]);
 assert.equal(studyData.resnet.pixel[1]/studyData.resnet.normal[1],24);
});
test('comparing both model families and qualified interpretation is required',()=>{
 const q=studyCreate();q.seen=[...studyRequired];q.variation='pixel';q.meaning='variation';q.plan='target';assert.equal(studyDone(q),true);q.seen.pop();assert.equal(studyDone(q),false);const restored=studyRestore(q);restored.seen.pop();assert.equal(q.seen.length,7);assert.throws(()=>studyRestore({...q,seen:['bit:normal','bit:normal']}));assert.throws(()=>studyRestore({...q,seen:['bit:missing']}));
});
