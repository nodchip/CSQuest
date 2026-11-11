import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {replayRetryEffect as replay,advanceRetryEffect as advance} from '../src/endgame-retry-effect.js';
const prefix=['send','lose','retry'];
test('repeated set stays on, repeated increment counts twice, fixed key counts once',()=>{const a=replay('set',[...prefix,'answer:same']);assert.equal(a.lamp,true);assert.equal(a.requests,2);const b=replay('increment',[...prefix,'answer:two']);assert.equal(b.number,2);assert.equal(b.requests,2);const c=replay('key',[...prefix,'answer:one']);assert.equal(c.number,1);assert.equal(c.requests,2);assert.equal(c.keyRecorded,true);});
test('wrong or premature action rejected, reset does not accumulate and saved state resumes',()=>{assert.equal(replay('increment',['retry']),null);assert.equal(replay('key',[...prefix,'answer:two']),null);assert.equal(replay('set',[...prefix,'answer:same','reset']),null);let h=[];for(let i=0;i<40;i++){h=advance('key',h,'send');h=advance('key',h,'reset');assert.equal(replay('key',JSON.parse(JSON.stringify(h))).step,0);}for(const a of [...prefix,'answer:one'])h=advance('key',h,a);assert.equal(replay('key',h).done,true);});
