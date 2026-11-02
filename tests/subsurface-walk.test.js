import test from 'node:test';
import assert from 'node:assert/strict';
import {subReplay,subEnumeration,subCreate,subAdvance,subRestore,subComplete} from '../src/subsurface-walk.js';
test('all 125 equally likely event sequences classify early exits, absorption and unresolved paths',()=>{
 assert.deepEqual(subEnumeration(),{same:28,other:12,absorbed:50,unresolved:35});
 assert.equal(subReplay(['up']).status,'same');assert.equal(subReplay(['right','up']).status,'other');assert.equal(subReplay(['absorb']).status,'absorbed');assert.equal(subReplay(['down','down','down']).status,'unresolved');
 assert.equal(subReplay(['left','left']).x,0);assert.throws(()=>subReplay(['up','down']));assert.throws(()=>subReplay(['wrong']));
});
test('partial walks restore, seen outcomes survive retries, and all comparisons are needed',()=>{
 const q=subCreate();q.mode='inside';subAdvance(q,'right');assert.deepEqual(subRestore(q),q);subAdvance(q,'up');assert.ok(q.seen.includes('other'));
 for(const actions of [['up'],['absorb'],['down','down','down']]){q.actions=[];for(const a of actions)subAdvance(q,a);}q.surfaceDone=true;q.difference='spread';assert.equal(subComplete(q),false);q.truncation='unknown';assert.equal(subComplete(q),true);
});
