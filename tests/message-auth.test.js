import {test} from 'node:test';
import assert from 'node:assert/strict';
import {authModes,authActions,authResult,createMessageAuth,messageAuthComplete,restoreMessageAuth} from '../src/message-auth.js';
test('a public fingerprint can be replaced, while the assumed tag rejects the attempted change but allows replay',()=>{
 assert.deepEqual(Object.keys(authActions).map(a=>authResult('hash',a).accepted),[true,false,true,true]);
 assert.deepEqual(Object.keys(authActions).map(a=>authResult('mac',a).accepted),[true,false,false,true]);assert.equal(authResult('mac','replay').replayed,true);assert.throws(()=>authResult('other','honest'),RangeError);
});
test('all eight trials are required and restoration validates and copies the record',()=>{
 const s=createMessageAuth();s.tested=Object.keys(authModes).flatMap(m=>Object.keys(authActions).map(a=>`${m}:${a}`));const copy=restoreMessageAuth(s);s.tested.pop();assert.equal(messageAuthComplete(s),false);assert.equal(messageAuthComplete(copy),true);assert.throws(()=>restoreMessageAuth({...copy,tested:['hash:honest','hash:honest']}),RangeError);
});
