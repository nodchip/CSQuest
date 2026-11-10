import test from 'node:test';
import assert from 'node:assert/strict';
import {replayRecursion,repairResult} from '../src/endgame-recursion.js';
test('empty list returns zero and parent frames add on the way back',()=>{
 const h=['base','next','call','call','base'];
 assert.equal(replayRecursion('sum',h).stack.at(-1).child,0);
 assert.equal(replayRecursion('sum',[...h,'add','add']).result,5);
 assert.equal(replayRecursion('sum',[...h,'add','base']),null);
 assert.equal(replayRecursion('sum',[...h,'add','add','next','call','call','call','base','add','add','add','next']).done,true);
});
test('tree accumulates all child results and empty boxes contribute zero',()=>{
 const h=['descend','descend','leaf','descend','empty','combine','descend','leaf','combine'];
 assert.equal(replayRecursion('tree',h).result,2);
 assert.equal(replayRecursion('tree',['combine']),null);
 assert.equal(replayRecursion('tree',[...h,'next','descend','leaf','descend','empty','descend','descend','leaf','descend','leaf','combine','combine']).result,3);
});
test('base case and progress are separate requirements, including empty input',()=>{
 assert.deepEqual(repairResult([],'repeat','rest'),{status:'repeat',at:[]});
 assert.deepEqual(repairResult([2,3],'stop','same'),{status:'repeat',at:[2,3]});
 assert.deepEqual(repairResult([2,3],'stop','rest'),{status:'done',value:5});
 const first=['base:stop','test:0','test:1','test:2','check'];
 assert.equal(replayRecursion('repair',first).scene,1);
 assert.equal(replayRecursion('repair',[...first,'test:0','test:1','test:2','check']),null);
 assert.equal(replayRecursion('repair',[...first,'progress:rest','test:0','test:1','test:2','check']).done,true);
});
