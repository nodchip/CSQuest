import test from 'node:test';
import assert from 'node:assert/strict';
import {ledgerUpdate,ledgerReplay,ledgerAppend,ledgerCreate,ledgerRestore,ledgerDone} from '../src/ledger-update.js';
const p=(filter,operation)=>({type:'preview',filter,operation}),rollback={type:'rollback'},commit={type:'commit'};
const histories=[[p('all','plus1'),rollback,p('lt2','plus1'),commit],[p('eqnull','zero'),rollback,p('isnull','zero'),commit],[p('all','minus2'),p('ge3','minus2'),commit]];
test('NULL comparison, NULL arithmetic and atomic constraint errors follow the specified model',()=>{
 assert.deepEqual(ledgerUpdate([3,1,0,null],'eqnull','zero'),{ok:true,matched:0,values:[3,1,0,null]});assert.deepEqual(ledgerUpdate([3,1,0,null],'isnull','zero'),{ok:true,matched:1,values:[3,1,0,0]});assert.deepEqual(ledgerUpdate([3,1,0,null],'all','plus1'),{ok:true,matched:4,values:[4,2,1,null]});assert.deepEqual(ledgerUpdate([3,1,0,null],'all','minus2'),{ok:false,matched:4,values:[3,1,0,null]});
 for(let i=0;i<3;i++)assert.equal(ledgerReplay(i,histories[i]).done,true);
});
test('a pending change must be resolved and restoration replays all evidence',()=>{
 assert.throws(()=>ledgerReplay(0,[commit]));assert.throws(()=>ledgerReplay(0,[p('all','plus1'),p('lt2','plus1')]));const q=ledgerCreate();q.histories=histories;q.reflection='unknown';assert.equal(ledgerDone(q),true);const copy=ledgerRestore(q);copy.histories[0][0].filter='lt2';assert.equal(q.histories[0][0].filter,'all');assert.throws(()=>ledgerRestore({...q,histories:[[commit],[],[]]}));
});
test('repeated previews and rollbacks preserve each mission proof, draft and completion',()=>{
 const q=ledgerCreate();
 for(let i=0;i<3;i++){
  let h=histories[i].slice(0,i===2?1:2);
  for(let n=0;n<80;n++){h=ledgerAppend(i,h,p('all','zero'));h=ledgerAppend(i,h,rollback);}
  h=ledgerAppend(i,h,histories[i].at(-2));
  q.histories[i]=h;const before=ledgerReplay(i,h);assert(before.proof&&before.pending);q.histories[i]=ledgerRestore(q).histories[i];
  q.histories[i]=ledgerAppend(i,q.histories[i],commit);assert(ledgerReplay(i,q.histories[i]).done);
 }
 q.reflection='unknown';assert(ledgerDone(ledgerRestore(q)));
});
test('invalid actions remain rejected when the history is compacted',()=>{let h=[];for(let i=0;i<12;i++){h=ledgerAppend(0,h,p('all','zero'));h=ledgerAppend(0,h,rollback);}assert.equal(h.length,24);assert.throws(()=>ledgerAppend(0,h,commit),RangeError);assert.equal(h.length,24);});
test('a pending preview at the limit remains available for commit or rollback',()=>{let h=[p('all','plus1'),rollback,p('all','minus2')];for(let i=0;i<10;i++){h=ledgerAppend(0,h,p('all','zero'));h=ledgerAppend(0,h,rollback);}h=ledgerAppend(0,h,p('lt2','plus1'));assert.equal(h.length,24);const state=ledgerReplay(0,h);assert(state.proof&&state.pending);assert(ledgerReplay(0,ledgerAppend(0,h,commit)).done);const rolled=ledgerReplay(0,ledgerAppend(0,h,rollback));assert(rolled.proof&&!rolled.pending&&!rolled.committed);});
