import test from 'node:test';
import assert from 'node:assert/strict';
import {gameValue} from '../src/duel.js';
import {createStoneTable,recordStoneEntry,restoreStoneTable,stoneTableComplete} from '../src/stone-tablebase.js';

test('retrograde entries agree with independent complete minimax for every state',()=>{
 let s=createStoneTable();assert.equal(s.entries[0].winning,false);
 for(let n=1;n<=8;n++){
  const legal=[1,2].filter(x=>x<=n),winning=legal.filter(x=>gameValue(n-x,'guardian')===1),choice=winning[0]??0;
  for(const wrong of [0,...legal].filter(x=>x!==choice))assert.equal(recordStoneEntry(s,wrong).ok,false,`${n}/${wrong}`);
  const r=recordStoneEntry(s,choice);assert.equal(r.ok,true);s=r.state;assert.deepEqual(s.entries[n].winningMoves,winning);assert.equal(s.entries[n].winning,gameValue(n,'player')===1);
 }
 assert.equal(stoneTableComplete(s),false);s.answer='universal';s.checked=true;assert.equal(stoneTableComplete(s),false);s.answer='limits';assert.equal(stoneTableComplete(s),true);assert.deepEqual(restoreStoneTable(s),s);assert.equal(recordStoneEntry(s,1).ok,false);
});
test('partial records replay and invalid predictions are not accepted',()=>{let s=createStoneTable();for(const c of [1,2,0])s=recordStoneEntry(s,c).state;assert.deepEqual(restoreStoneTable(s),s);assert.throws(()=>restoreStoneTable({...s,history:[1,1]}));});
