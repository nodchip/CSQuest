import test from 'node:test';
import assert from 'node:assert/strict';
import {replayQueue} from '../src/endgame-queue.js';

test('arrival times and a shared output determine wait times',()=>{
 const actions=['send:A','send:B','send:A','send:B','send:A','send:B','send:C','send:A','wait','wait','send:B'];
 const result=replayQueue(actions);assert.equal(result.done,true);
 assert.deepEqual(result.results,[[['A',0],['B',1]],[['A',0],['B',0]],[['A',0],['B',1],['C',2]],[['A',0],['B',0]]]);
 assert.equal(replayQueue([...actions,'wait']),null);
});
test('later messages cannot overtake and waiting is permitted only when no message is ready',()=>{
 assert.equal(replayQueue(['send:B']),null);
 assert.equal(replayQueue(['wait']),null);
 assert.equal(replayQueue(['send:A','send:A']),null);
 assert.equal(replayQueue(['send:A','send:B','send:A','send:B','send:A','send:B','send:C','send:A','send:B']),null);
});
