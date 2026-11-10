import test from 'node:test';
import assert from 'node:assert/strict';
import {replayVersioning} from '../src/endgame-versioning.js';
test('viewing both recorded snapshots does not change their contents or the draft',()=>{
 const h=['view:v2','view:v1'];
 assert.equal(replayVersioning('snapshot',[...h,'choose:v2']),null);
 assert.equal(replayVersioning('snapshot',[...h,'choose:v1','view:v1','view:v2','choose:v2']).done,true);
 assert.equal(replayVersioning('snapshot',['view:v1','choose:v1']),null);
});
test('non-overlapping changes combine and differing edits require a resolvable conflict',()=>{
 const first=['merge:b','merge:a','check'];
 assert.equal(replayVersioning('merge',['merge:a','merge:b','check']).scene,1);
 const p=replayVersioning('merge',[...first,'merge:b','merge:a']);
 assert.equal(p.pending,true);assert.equal(p.merged.route,'舟の道');
 assert.equal(replayVersioning('merge',[...first,'merge:b','merge:a','check']),null);
 const h=[...first,'merge:b','merge:a','resolve:a'];
 assert.equal(replayVersioning('merge',[...h,'check']),null);
 assert.equal(replayVersioning('merge',[...h,'resolve:b','check']).done,true);
});
test('releasing requires the requested snapshot to have its own passing test',()=>{
 assert.equal(replayVersioning('release',['release:v2']),null);
 const h=['test:v2','release:v2'];assert.equal(replayVersioning('release',h).scene,1);
 assert.equal(replayVersioning('release',[...h,'release:v1']),null);
 assert.equal(replayVersioning('release',[...h,'test:v1','release:v1']).done,true);
});
