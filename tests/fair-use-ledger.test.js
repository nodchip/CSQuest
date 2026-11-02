import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {fairFactors,fairCards,fairCreate,fairInspect,fairComplete,fairRestore} from '../src/fair-use-ledger.js';

test('every card maps to one of four factors and wrong choices never advance it',()=>{
 for(const [card,v] of Object.entries(fairCards))for(const factor of Object.keys(fairFactors)){
  const q=fairCreate();q.card=card;q.choice=factor;fairInspect(q);assert.equal(q.last.correct,factor===v.factor);assert.equal(q.checked.includes(card),factor===v.factor);
 }
});
test('all cards, the bounded case conclusion and contextual analysis are required',()=>{
 const q=fairCreate();for(const [id,v] of Object.entries(fairCards)){q.card=id;q.choice=v.factor;fairInspect(q);}
 q.caseAnswer='all';q.reflection='context';assert.equal(fairComplete(q),false);q.caseAnswer='specific';assert.equal(fairComplete(q),true);
 const copy=fairRestore(q);copy.checked.pop();assert.equal(q.checked.length,8);
 assert.throws(()=>fairRestore({...q,last:{...q.last,correct:false}}));assert.throws(()=>fairRestore({...q,checked:['review','review']}));
});
