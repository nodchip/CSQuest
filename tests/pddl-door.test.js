import test from 'node:test';
import assert from 'node:assert/strict';
import {createPddlDoor,pddlDoorComplete,restorePddlDoor,doorStep,doorPlanState} from '../src/pddl-door.js';
import {createStripsDoor,restoreStripsDoor} from '../src/strips-door.js';

test('all four fragments must be correctly interpreted and checked',()=>{
 const s=createPddlDoor();
 s.answers=[0,1,0,1];s.checked=[true,true,true,true];
 assert.equal(pddlDoorComplete(s),false);
 s.answers[3]=0;
 assert.equal(pddlDoorComplete(s),false);
 s.paths={without:['take','open'],with:['open']};
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
test('door plans enforce preconditions, update facts and restore both problems',()=>{
 assert.equal(doorStep(2,'open'),null);
 assert.equal(doorStep(2,'take'),3);
 assert.equal(doorStep(3,'open'),5);
 assert.equal(doorPlanState('without',['take','open']),5);
 assert.equal(doorPlanState('with',['open']),5);
 assert.throws(()=>doorPlanState('without',['open']));
 assert.throws(()=>doorPlanState('with',['take']));
 assert.throws(()=>doorPlanState('with',['open','open']));
 const old={index:0,answers:[0,null,null,null],checked:[true,false,false,false]};
 assert.deepEqual(restorePddlDoor(old).paths,{without:[],with:[]});
 assert.throws(()=>restorePddlDoor({...old,paths:{without:['open'],with:[]}}));
});
