import test from 'node:test';
import assert from 'node:assert/strict';
import {imitationPrompts,roomInputs,createImitationRoom,imitationRoomAct,restoreImitationRoom,imitationRoomComplete} from '../src/imitation-room.js';
const act=(s,a)=>{const r=imitationRoomAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
test('each fictional response must be examined before the origin is revealed',()=>{
 let s=createImitationRoom();assert.equal(imitationRoomAct(s,'reveal').ok,false);assert.equal(imitationRoomAct(s,'input:sun').ok,false);
 for(const who of ['a','b'])for(const prompt of Object.keys(imitationPrompts))s=act(s,`ask:${who}:${prompt}`);
 assert.equal(imitationRoomAct(s,'reveal').ok,false);s=act(s,'guess:unknown');s=act(s,'reveal');assert.equal(s.revealed,true);
});
test('both symbolic rules and the two nuanced conclusions are required',()=>{
 let s=createImitationRoom();for(const who of ['a','b'])for(const prompt of Object.keys(imitationPrompts))s=act(s,`ask:${who}:${prompt}`);
 for(const a of ['guess:a','reveal','input:sun','output:circle','room:check'])s=act(s,a);assert.equal(s.report.correct,false);assert.deepEqual(s.roomSeen,[]);
 for(const [id,v] of Object.entries(roomInputs))for(const a of [`input:${id}`,`output:${v.answer}`,'room:check'])s=act(s,a);
 for(const a of ['test:proof','room:debate','check'])s=act(s,a);assert.equal(imitationRoomComplete(s),false);
 for(const a of ['test:limits','check'])s=act(s,a);assert.equal(imitationRoomComplete(s),true);
 assert.deepEqual(restoreImitationRoom(JSON.parse(JSON.stringify(s))),s);assert.throws(()=>restoreImitationRoom({history:['reveal']}),RangeError);
});
