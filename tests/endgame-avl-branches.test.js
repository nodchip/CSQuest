import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {replayAvlBranches as replay} from '../src/endgame-avl-branches.js';
const initial=['insert','insert','insert'], examples={ll:['rotate:30:right'],rr:['rotate:10:left'],lr:['rotate:10:left','rotate:30:right']};
test('all three rotations yield the expected ordered balanced tree',()=>{
 for(const [kind,rotations] of Object.entries(examples)){const s=replay(kind,[...initial,...rotations,'check']);assert.equal(s.done,true);assert.deepEqual(s.trial.tree,{key:20,left:{key:10,left:null,right:null},right:{key:30,left:null,right:null}});assert.equal(replay(kind,[...initial,...rotations,'check','insert']),null);}
});
test('invalid moves and unfinished checks are rejected, history restores and reset clears',()=>{
 assert.equal(replay('ll',['rotate:30:right']),null);assert.equal(replay('ll',[...initial,'check']),null);assert.equal(replay('ll',[...initial,'rotate:30:left']),null);assert.equal(replay('lr',[...initial,'rotate:10:left','check']),null);
 const s=replay('lr',[...initial,'rotate:10:left']);assert.equal(s.trial.tree.key,30);assert.equal(s.trial.tree.left.key,20);assert.equal(replay('lr',[...initial,'reset']).trial.index,0);
});
