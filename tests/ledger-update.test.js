import test from 'node:test';
import assert from 'node:assert/strict';
import {ledgerUpdate,ledgerReplay,ledgerCreate,ledgerRestore,ledgerDone} from '../src/ledger-update.js';
const p=(filter,operation)=>({type:'preview',filter,operation}),rollback={type:'rollback'},commit={type:'commit'};
const histories=[[p('all','plus1'),rollback,p('lt2','plus1'),commit],[p('eqnull','zero'),rollback,p('isnull','zero'),commit],[p('all','minus2'),p('ge3','minus2'),commit]];
test('NULL comparison, NULL arithmetic and atomic constraint errors follow the specified model',()=>{
 assert.deepEqual(ledgerUpdate([3,1,0,null],'eqnull','zero'),{ok:true,matched:0,values:[3,1,0,null]});assert.deepEqual(ledgerUpdate([3,1,0,null],'isnull','zero'),{ok:true,matched:1,values:[3,1,0,0]});assert.deepEqual(ledgerUpdate([3,1,0,null],'all','plus1'),{ok:true,matched:4,values:[4,2,1,null]});assert.deepEqual(ledgerUpdate([3,1,0,null],'all','minus2'),{ok:false,matched:4,values:[3,1,0,null]});
 for(let i=0;i<3;i++)assert.equal(ledgerReplay(i,histories[i]).done,true);
});
test('a pending change must be resolved and restoration replays all evidence',()=>{
 assert.throws(()=>ledgerReplay(0,[commit]));assert.throws(()=>ledgerReplay(0,[p('all','plus1'),p('lt2','plus1')]));const q=ledgerCreate();q.histories=histories;q.reflection='unknown';assert.equal(ledgerDone(q),true);const copy=ledgerRestore(q);copy.histories[0][0].filter='lt2';assert.equal(q.histories[0][0].filter,'all');assert.throws(()=>ledgerRestore({...q,histories:[[commit],[],[]]}));
});
