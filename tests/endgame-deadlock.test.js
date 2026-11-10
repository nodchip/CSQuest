import test from 'node:test';
import assert from 'node:assert/strict';
import {replayDeadlock} from '../src/endgame-deadlock.js';
test('a single-instance cycle requires each worker to wait for the other holder',()=>{
 const h=['take:A:X','take:B:Y','take:A:Y'];assert.equal(replayDeadlock('cycle',[...h,'check']),null);
 assert.equal(replayDeadlock('cycle',[...h,'finish:A']),null);
 const cycle=[...h,'take:B:X','check'];assert.equal(replayDeadlock('cycle',cycle).scene,1);
 const safe=['take:A:Y','take:B:Y','take:A:X','finish:A','take:B:Y','take:B:X','finish:B','check'];
 assert.equal(replayDeadlock('cycle',[...cycle,...safe]).done,true);
});
test('common order prevents reverse requests and permits the waiting worker after release',()=>{
 assert.equal(replayDeadlock('order',['take:A:Y']),null);
 const h=['take:A:X','take:B:X','take:A:Y','finish:A','take:B:X','take:B:Y','finish:B','check'];
 assert.equal(replayDeadlock('order',h).scene,1);
 assert.equal(replayDeadlock('order',[...h,'take:A:X','take:B:X','take:A:Y','take:A:Z','finish:A','take:B:X','take:B:Y','take:B:Z','finish:B','check']).done,true);
});
test('repeated bias can postpone one worker; FIFO serves each in two symmetric scenes',()=>{
 assert.equal(replayDeadlock('fairness',['serve:A','switch']),null);
 const h=['serve:A','serve:A','serve:A','switch'];assert.deepEqual(replayDeadlock('fairness',h).queue,['B','A']);assert.equal(replayDeadlock('fairness',[...h,'serve:A']),null);
 assert.equal(replayDeadlock('fairness',[...h,'serve:B','serve:A','check','serve:B','serve:B','serve:B','switch','serve:A','serve:B','check']).done,true);
});
