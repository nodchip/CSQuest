import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sessionInitial,sessionExecute,sessionReplay,sessionCreate,sessionStep,sessionComplete,sessionRestore} from '../src/web-session.js';

test('separate browsers, returning, client deletion and server expiry',()=>{
 const q=sessionCreate();
 assert.throws(()=>sessionStep(q,'add:A'));
 for(const a of ['visit:A','add:A','visit:A','visit:B']){sessionStep(q,a);assert.deepEqual(sessionRestore(q),q);}
 let s=sessionReplay(q.history);assert.deepEqual(s.cookies,{A:'S1',B:'S2'});assert.deepEqual(s.sessions,{S1:1,S2:0});assert(s.evidence.resume&&s.evidence.isolation);
 sessionStep(q,'clear:A');s=sessionReplay(q.history);assert.equal(s.cookies.A,null);assert.equal(s.sessions.S1,1);
 sessionStep(q,'visit:A');s=sessionReplay(q.history);assert.equal(s.cookies.A,'S3');assert.equal(s.shown.A,0);assert.equal(s.sessions.S1,1);assert(s.evidence.clear);
 sessionStep(q,'add:A');sessionStep(q,'expire:A');s=sessionReplay(q.history);assert.equal(s.cookies.A,'S3');assert(!Object.hasOwn(s.sessions,'S3'));
 sessionStep(q,'visit:A');s=sessionReplay(q.history);assert.equal(s.cookies.A,'S4');assert.equal(s.shown.A,0);assert(s.evidence.expiry);assert(!sessionComplete(q));q.answer='linked';assert(sessionComplete(q));
});
test('failed operations and forged or oversized histories are rejected',()=>{
 const s=sessionInitial();for(const a of ['unknown','clear:A','expire:A','add:B'])assert.throws(()=>sessionExecute(s,a));
 assert.throws(()=>sessionReplay(['visit:A','expire:A']));assert.throws(()=>sessionReplay(Array(61).fill('visit:A')));assert.throws(()=>sessionRestore({history:['add:A'],answer:'linked'}));
});
test('varying the order and updates still keeps each session distinct',()=>{
 const s=sessionReplay(['visit:B','add:B','add:B','visit:A','add:A','visit:A','add:B','clear:A','visit:A','add:A','expire:A','visit:A']);
 assert.equal(s.sessions.S1,3);assert.equal(s.sessions.S2,1);assert.equal(s.shown.B,3);assert(s.evidence.clear&&s.evidence.expiry&&s.evidence.resume);assert.equal(s.evidence.isolation,false);
});
