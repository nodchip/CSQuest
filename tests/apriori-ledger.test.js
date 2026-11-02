import test from 'node:test';
import assert from 'node:assert/strict';
import {aprioriSets,aprioriCount,aprioriSubsets,aprioriExpected,aprioriReplay,aprioriCreate,aprioriComplete,aprioriRestore} from '../src/apriori-ledger.js';

test('item counts and immediate subsets match independent enumeration',()=>{
 const expected={H:4,C:4,B:5,HC:3,HB:3,CB:3,HCB:2};for(const [id,n] of Object.entries(expected))assert.equal(aprioriCount(id),n,id);
 assert.deepEqual(aprioriSubsets('HC'),['H','C']);assert.deepEqual(aprioriSubsets('HCB'),['HC','HB','CB']);assert.throws(()=>aprioriCount('X'),RangeError);
});
test('each order within the two levels gives the expected decisions and valid replay',()=>{
 const perms=a=>a.length===1?[a]:a.flatMap((x,i)=>perms(a.filter((_,j)=>j!==i)).map(xs=>[x,...xs]));
 for(const mode of ['3','4'])for(const singles of perms(['H','C','B']))for(const pairs of perms(['HC','HB','CB'])){
  const history=[],counted=[];assert.equal(aprioriExpected(mode,history,'HCB'),'wait');
  for(const id of [...singles,...pairs,'HCB']){const decision=aprioriExpected(mode,history,id);assert.equal(decision,id==='HCB'?(mode==='3'?'infrequent':'prune'):id.length===1||mode==='3'?'frequent':'infrequent');if(decision!=='prune')counted.push(id);history.push({id,decision});}
  assert.deepEqual(aprioriReplay(mode,history,counted),history);assert.equal(aprioriExpected(mode,history,'H'),'done');
 }
});
test('saved paths need valid order, counted evidence, both modes and reflection',()=>{
 const q=aprioriCreate();for(const mode of ['3','4'])for(const id of Object.keys(aprioriSets)){const d=aprioriExpected(mode,q.runs[mode],id);if(d!=='prune')q.counted[mode].push(id);q.runs[mode].push({id,decision:d});}
 assert.equal(aprioriComplete(q),false);q.reflection='subset';assert.equal(aprioriComplete(q),true);const copy=aprioriRestore(q);copy.runs['3'].pop();assert.equal(q.runs['3'].length,7);
 assert.throws(()=>aprioriReplay('3',[{id:'HC',decision:'frequent'}],['HC']),RangeError);assert.throws(()=>aprioriReplay('3',[{id:'H',decision:'frequent'}],[]),RangeError);assert.throws(()=>aprioriRestore({...q,runs:{...q.runs,'4':[{id:'H',decision:'prune'}]}}),RangeError);
});
