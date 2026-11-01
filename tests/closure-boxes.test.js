import test from 'node:test';
import assert from 'node:assert/strict';
import {closureActions,closureSequence,closureBoxRun,createClosureBoxes,stepClosureBoxes,closureBoxesComplete,restoreClosureBoxes} from '../src/closure-boxes.js';

test('all action sequences through length five agree with two independently counted bindings',()=>{
 const actions=Object.keys(closureActions);
 function check(seq){const r=closureBoxRun(seq);let a=0,b=0;const expected=[];for(const op of seq){if(op==='incA')a++;if(op==='incB')b++;expected.push(op==='incB'||op==='readB'?b:a);}assert.deepEqual(r.boxes,{A:a,B:b});assert.deepEqual(r.outputs,expected);}
 function visit(prefix,n){check(prefix);if(n)for(const a of actions)visit([...prefix,a],n-1);}visit([],5);
});
test('wrong predictions leave history unchanged; restoration requires the intended sequence',()=>{
 let s=createClosureBoxes();s.action='incA';s.prediction=0;assert.equal(stepClosureBoxes(s).history.length,0);
 for(const action of closureSequence){s.action=action;s.prediction=closureBoxRun([...s.history,action]).outputs.at(-1);s=stepClosureBoxes(s);}
 assert.deepEqual(closureBoxRun(s.history).outputs,[1,0,2,1,2,2]);
 assert.equal(closureBoxesComplete({...s,answer:'shared',checked:true}),true);assert.deepEqual(restoreClosureBoxes(s).history,closureSequence);
 assert.throws(()=>restoreClosureBoxes({...s,history:['readB']}));assert.throws(()=>closureBoxRun(['invalid']));
});
