import test from 'node:test';import assert from 'node:assert/strict';import {replayLedgerDecomposition} from '../src/endgame-ledger-decomposition.js';
const village=['pair:O1,V1','pair:O2,V1','pair:O3,V2','check','answer:restored'];
const name=['pair:O1,V1','pair:O1,V2','pair:O2,V1','pair:O2,V2','pair:O3,V1','pair:O3,V2','check','answer:spurious'];
test('distinct villages have exactly three original combinations; same-name join has six',()=>{
 const a=replayLedgerDecomposition('village',village),b=replayLedgerDecomposition('name',name);
 assert.deepEqual(a.rows.map(r=>[r.order,r.village,r.name]),[['O1','V1','森'],['O2','V1','森'],['O3','V2','森']]);
 assert.deepEqual(b.rows.map(r=>[r.order,r.village]),[['O1','V1'],['O1','V2'],['O2','V1'],['O2','V2'],['O3','V1'],['O3','V2']]);
 assert.equal(a.done,true);assert.equal(b.done,true);assert.equal(replayLedgerDecomposition('update',['update:O1','answer:inconsistent']).done,true);
});
test('incomplete joins, wrong conclusions and malformed or post-completion histories are rejected',()=>{
 for(const [k,h] of [['village',['check']],['village',['pair:O1,V2','check']],['name',['pair:O1,V1','check']],['update',['answer:inconsistent']],['update',['update:O1','answer:consistent']],['village',[...village,'check']],['name',['pair:O4,V1']]])assert.equal(replayLedgerDecomposition(k,h),null);
 assert.deepEqual(replayLedgerDecomposition('village',['pair:O1,V1','pair:O1,V1']).selected,[]);
});
