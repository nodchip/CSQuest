import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createDataflowLoop,dataflowLoopStable,dataflowLoopStep,restoreDataflowLoop} from '../src/dataflow-loop.js';

test('the back edge adds the second definition and exit must be updated again',()=>{
 let s=createDataflowLoop();assert.equal(dataflowLoopStep(s,'finish').done,false);
 for(const action of ['test','exit','body','test'])s=dataflowLoopStep(s,action);
 assert.deepEqual([s.test,s.body,s.exit],[3,2,1]);assert.equal(dataflowLoopStable(s),false);
 s=dataflowLoopStep(s,'exit');assert.deepEqual([s.test,s.body,s.exit],[3,2,3]);assert.equal(dataflowLoopStable(s),true);assert.equal(dataflowLoopStep(s,'finish').done,true);
});
test('all update orders that reach stability agree and drafts reject impossible steps',()=>{
 const initial=createDataflowLoop(),todo=[initial],seen=new Set();let stable=0;
 while(todo.length){const s=todo.pop(),key=[s.test,s.body,s.exit].join(',');if(seen.has(key))continue;seen.add(key);if(dataflowLoopStable(s)){assert.deepEqual([s.test,s.body,s.exit],[3,2,3]);stable++;}
  for(const action of ['test','body','exit']){const n=dataflowLoopStep(s,action);if(n.history.length>s.history.length)todo.push(n);}}
 assert.equal(stable,1);assert.throws(()=>restoreDataflowLoop({history:['body']}),RangeError);assert.throws(()=>restoreDataflowLoop({history:['finish']}),RangeError);
 const restored=restoreDataflowLoop({history:['test','body']});assert.deepEqual([restored.test,restored.body,restored.exit],[1,2,0]);
});
