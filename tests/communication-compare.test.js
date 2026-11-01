import test from 'node:test';
import assert from 'node:assert/strict';
import {createCommunication,communicationState,communicationComplete,restoreCommunication} from '../src/communication-compare.js';

test('same writes yield queued messages, last value, and separate keyed values',()=>{
 assert.deepEqual(communicationState('queue',['send','send','read','read']).reads,['赤','青']);
 assert.deepEqual(communicationState('register',['send','send','read','read']).reads,['青','青']);
 assert.deepEqual(communicationState('map',['send','send','blue','red']).reads,['青','赤']);
 assert.throws(()=>communicationState('queue',['read']));
 assert.throws(()=>communicationState('register',['send','send','red']));
 const s=createCommunication();
 s.histories={queue:['send','send','read','read'],register:['send','send','read','read'],map:['send','send','red','red']};
 assert.equal(communicationComplete(s),false);
 s.histories.map[3]='blue';assert.equal(communicationComplete(s),true);
 const copy=restoreCommunication(s);copy.histories.map.pop();assert.equal(s.histories.map.length,4);
 assert.throws(()=>restoreCommunication({...s,histories:{...s.histories,map:['blue']}}));
});
