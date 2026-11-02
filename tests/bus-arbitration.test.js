import {test} from 'node:test';
import assert from 'node:assert/strict';
import {arbitrationWinner,arbitrationCreate,arbitrationStep,arbitrationComplete,arbitrationRestore} from '../src/bus-arbitration.js';

test('fixed priority and rotating priority select at most one eligible request per slot',()=>{
 for(const [policy,expected] of Object.entries({fixed:['A','A','A','B'],round:['A','B','C','B']})){
  const history=[];
  for(const choice of expected){assert.equal(arbitrationWinner(policy,history),choice);for(const wrong of ['A','B','C'].filter(x=>x!==choice))assert.throws(()=>arbitrationWinner(policy,[...history,wrong]));history.push(choice);}
  assert.equal(arbitrationWinner(policy,history),null);assert.throws(()=>arbitrationWinner(policy,[...history,'A']));
 }
});
test('restore validates both histories; completion needs both policies and reflection',()=>{
 const q=arbitrationCreate();for(const [p,choices] of Object.entries({fixed:['A','A','A','B'],round:['A','B','C','B']})){q.policy=p;for(const c of choices){arbitrationStep(q,c);assert.deepEqual(arbitrationRestore(q),q);}}
 assert.equal(arbitrationComplete(q),false);q.answer='waiting';assert.equal(arbitrationComplete(q),true);
 const bad=structuredClone(q);bad.histories.round[1]='A';assert.throws(()=>arbitrationRestore(bad));
});
