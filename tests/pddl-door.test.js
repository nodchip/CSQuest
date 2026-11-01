import test from 'node:test';
import assert from 'node:assert/strict';
import {createPddlDoor,pddlDoorComplete,restorePddlDoor} from '../src/pddl-door.js';
import {createStripsDoor,restoreStripsDoor} from '../src/strips-door.js';

test('all four fragments must be correctly interpreted and checked',()=>{
 const s=createPddlDoor();
 s.answers=[0,1,0,1];s.checked=[true,true,true,true];
 assert.equal(pddlDoorComplete(s),false);
 s.answers[3]=0;
 assert.equal(pddlDoorComplete(s),true);
 assert.deepEqual(restorePddlDoor(s),s);
 const copy=restorePddlDoor(s);copy.answers[0]=2;assert.equal(s.answers[0],0);
 assert.throws(()=>restorePddlDoor({...s,answers:[0,1,0,3]}));
 assert.throws(()=>restorePddlDoor({...s,answers:[null,1,0,0]}));
});
test('old door drafts gain an unanswered scroll',()=>{
 const {pddl,...old}=createStripsDoor();
 assert.deepEqual(restoreStripsDoor(old).pddl,createPddlDoor());
});
