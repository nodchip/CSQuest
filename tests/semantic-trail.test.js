import test from 'node:test';
import assert from 'node:assert/strict';
import {semanticCards,semanticQuestions,semanticCreate,semanticRestore,semanticComplete} from '../src/semantic-trail.js';

test('two directed statements are required and unknown differs from false',()=>{
  assert.deepEqual(semanticCards.filter(c=>c.correct).map(c=>c.id),['a','c']);
  const q=semanticCreate(); assert.equal(semanticComplete(q),false);
  q.cards=['a','c']; q.answers=['yes','no','unknown']; assert.equal(semanticComplete(q),false);
  q.answers=semanticQuestions.map(x=>x.answer); assert.equal(semanticComplete(q),true);
});
test('draft validation rejects impossible states and makes copies',()=>{
  for(const q of [{cards:['a','a'],answers:[null,null,null]},{cards:['b'],answers:[null,null,null]},{cards:['a'],answers:['yes',null,null]},{cards:['a','c'],answers:['true',null,null]}]) assert.throws(()=>semanticRestore(q));
  const q={cards:['a','c'],answers:['yes',null,'unknown']},copy=semanticRestore(q); copy.cards.pop(); copy.answers[0]=null;
  assert.deepEqual(q,{cards:['a','c'],answers:['yes',null,'unknown']});
});
