import test from 'node:test';
import assert from 'node:assert/strict';
import {syntaxCases,createSyntax,syntaxStep,syntaxCorrect,createSyntaxSet,restoreSyntax,syntaxComplete} from '../src/syntax-tree.js';

test('both possible trees preserve operand order and calculate independent expected values',()=>{
  const expected={priority:{0:20,1:14},parentheses:{0:20,1:14},associativity:{0:3,1:7}};
  for(const id of Object.keys(syntaxCases))for(const first of [0,1]){
    const result=syntaxStep(syntaxStep(createSyntax(id),first),1-first);
    assert.equal(result.parts[0].value,expected[id][first]);
    const leaves=node=>node.op?[...leaves(node.left),...leaves(node.right)]:[node.value];
    assert.deepEqual(leaves(result.parts[0]),syntaxCases[id].numbers);
    assert.equal(syntaxCorrect(result),first===syntaxCases[id].first);
  }
});
test('partial and incorrect constructions are not complete and histories replay correctly',()=>{
  const saved={selected:'priority',history:{priority:[1],parentheses:[],associativity:[]}};
  const partial=restoreSyntax(saved);assert.deepEqual(partial.states.priority.history,[1]);assert.equal(syntaxComplete(partial),false);
  for(const id of Object.keys(syntaxCases)){const first=syntaxCases[id].first;partial.states[id]=syntaxStep(syntaxStep(createSyntax(id),first),1-first);}
  assert.equal(syntaxComplete(partial),true);partial.states.priority=syntaxStep(syntaxStep(createSyntax('priority'),0),1);assert.equal(syntaxComplete(partial),false);
  assert.equal(syntaxComplete(createSyntaxSet()),false);
});
test('unreachable or malformed histories cannot be restored',()=>{
  const base={selected:'priority',history:{priority:[],parentheses:[],associativity:[]}};
  assert.throws(()=>restoreSyntax({...base,history:{...base.history,priority:[0,0]}}),RangeError);
  assert.throws(()=>restoreSyntax({...base,history:{...base.history,priority:[2]}}),RangeError);
  assert.throws(()=>restoreSyntax({...base,selected:'missing'}),RangeError);
});
