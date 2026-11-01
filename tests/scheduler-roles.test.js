import test from 'node:test';
import assert from 'node:assert/strict';
import {roleCases,roleSequence,roleReplay,createSchedulerRoles,schedulerRolesComplete,restoreSchedulerRoles} from '../src/scheduler-roles.js';
test('both disk orders preserve suspended state and produce the expected head movement',()=>{
 for(const id of Object.keys(roleCases)){const seq=roleSequence(id),suspended=roleReplay(id,seq.slice(0,4));assert.equal(suspended.A,'退避中・I/O 待ち');const after=roleReplay(id,seq.slice(0,9));assert.equal(after.A,'退避中・実行可能');assert.equal(after.B,'実行可能');assert.equal(after.movement,id==='arrival'?118:60);assert.deepEqual(after.pending,[]);const done=roleReplay(id,seq);assert.equal(done.A,'完了');assert.equal(done.B,'完了');assert.equal(done.cpu,'空き');}
 assert.throws(()=>roleReplay('arrival',['dispatchA']));assert.throws(()=>roleReplay('near',['admitA','dispatchA','requestA','suspendA','admitB','dispatchB','requestB','serveA']));
});
test('saved histories replay and both journeys and reflection are required',()=>{
 const s=createSchedulerRoles();for(const id of Object.keys(roleCases))s.histories[id]=roleSequence(id);s.answer='roles';s.checked=true;assert.ok(schedulerRolesComplete(s));assert.deepEqual(restoreSchedulerRoles(s),s);s.histories.near.pop();assert.equal(schedulerRolesComplete(s),false);assert.throws(()=>restoreSchedulerRoles({...s,histories:{...s.histories,arrival:['finishA']}}));
});
