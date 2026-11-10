import test from 'node:test';
import assert from 'node:assert/strict';
import {replayOs} from '../src/endgame-os.js';

test('the model serves each request in arrival order in either order',()=>{
 let p=replayOs('queue',['arrive:B','arrive:A','print']);assert.deepEqual(p.printed,['B']);assert.deepEqual(p.queue,['A']);
 assert.equal(replayOs('queue',['print']),null);
 const h=['arrive:A','arrive:B','print','print','check','arrive:B','arrive:A','print','print','check'];assert.equal(replayOs('queue',h).done,true);
});
test('restart loses unsaved working data while a completed save remains',()=>{
 let p=replayOs('storage',['draft','restart','read']);assert.equal(p.volatile,null);assert.equal(p.durable,null);assert.equal(p.read,null);
 assert.equal(replayOs('storage',['draft','restart','read','check']),null);
 const h=['draft','save','restart','read','check','draft','save','restart','read','check'];p=replayOs('storage',h);assert.equal(p.done,true);
});
test('the model denies the other job while allowing the owner after restart',()=>{
 const h=['draft','save','restart','read:B'];let p=replayOs('access',h);assert.equal(p.denied,true);assert.equal(p.read,null);assert.equal(p.durable,'Ａの荷札');
 assert.equal(replayOs('access',[...h,'check']),null);p=replayOs('access',[...h,'read:A','check']);assert.equal(p.done,true);
});
