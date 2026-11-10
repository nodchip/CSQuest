import test from 'node:test';
import assert from 'node:assert/strict';
import {replayCondition} from '../src/endgame-condition.js';
const a=['lock:A','empty:A','wait:A'],b=['lock:B','empty:B','wait:B'],deliver=['lock:P','put','broadcast','unlock:P'],takeA=['lock:A','full:A','take:A','unlock:A'],waitB=['lock:B','empty:B','wait:B'],takeB=['lock:B','full:B','take:B','unlock:B'];
test('wait releases the mutex so a producer can acquire it; return re-acquires it',()=>{
 let p=replayCondition('wait',a);assert.equal(p.state.lock,null);assert.deepEqual(p.state.waiting,['A']);
 p=replayCondition('wait',[...a,...deliver]);assert.deepEqual(p.state.ready,['A']);assert.equal(p.state.items,1);
 assert.equal(replayCondition('wait',[...a,...deliver,'full:A']),null);
 p=replayCondition('wait',[...a,...deliver,...takeA]);assert.equal(p.done,true);assert.deepEqual(p.state.taken,['A']);assert.equal(p.state.items,0);
});
test('a broadcast is not a reservation; second waiter sees empty and waits again',()=>{
 const prefix=[...a,...b,...deliver];let p=replayCondition('notify',prefix);assert.deepEqual(p.state.ready,['A','B']);
 p=replayCondition('notify',[...prefix,...takeA,'lock:B']);assert.equal(p.state.items,0);assert.equal(p.state.lock,'B');
 assert.equal(replayCondition('notify',[...prefix,...takeA,'lock:B','full:B']),null);
 p=replayCondition('notify',[...prefix,...takeA,...waitB]);assert.equal(p.done,true);assert.deepEqual(p.state.waiting,['B']);assert.equal(p.state.lock,null);
});
test('restored partial history can continue through a second delivery; completed history rejects input',()=>{
 const partial=[...a,...b,...deliver,...takeA,...waitB];const restored=JSON.parse(JSON.stringify(partial));assert.deepEqual(replayCondition('recheck',restored).state.waiting,['B']);
 const all=[...restored,...deliver,...takeB],p=replayCondition('recheck',all);assert.equal(p.done,true);assert.deepEqual(p.state.taken,['A','B']);assert.equal(p.state.delivered,2);assert.equal(p.state.items,0);assert.equal(replayCondition('recheck',[...all,'lock:A']),null);
});
