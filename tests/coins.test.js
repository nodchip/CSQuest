import test from 'node:test';
import assert from 'node:assert/strict';
import {denominations,createCoins,coinCandidates,chooseCoin,greedyCoins,coinDifference,coinsComplete,restoreCoins} from '../src/coins.js';

// Exhaustively enumerate multisets independently of the table recurrence.
function brute(amount){let best=Infinity;for(let a=0;a<=amount;a++)for(let b=0;b<=amount;b++)for(let c=0;c<=amount;c++)if(a+3*b+4*c===amount)best=Math.min(best,a+b+c);return best;}
test('every valid choice and every table value agree with exhaustive enumeration',()=>{
  let frontier=[createCoins()];
  for(let amount=1;amount<=10;amount++){
    const next=[];
    for(const state of frontier)for(const {coin} of coinCandidates(state)){
      const result=chooseCoin(state,coin);
      if(result.choices.length>state.choices.length){assert.equal(result.counts[amount],brute(amount));next.push(result);}
      else assert.equal(state.counts[amount-coin]+1>brute(amount),true);
    }
    assert.ok(next.length);frontier=next;
  }
  assert.deepEqual(greedyCoins(6),[4,1,1]);assert.deepEqual(greedyCoins(10),[4,4,1,1]);
  for(const state of frontier)assert.deepEqual(coinDifference(state),[6,10]);
});
test('comparison requires all and only the counterexamples',()=>{
  let state=createCoins();while(state.counts.length<=10){const candidates=coinCandidates(state),min=Math.min(...candidates.map(c=>c.count));state=chooseCoin(state,candidates.find(c=>c.count===min).coin);}
  assert.equal(coinsComplete({...state,checked:true,selected:[6]}),false);
  assert.equal(coinsComplete({...state,checked:true,selected:[6,8,10]}),false);
  assert.equal(coinsComplete({...state,checked:false,selected:[6,10]}),false);
  assert.equal(coinsComplete({...state,checked:true,selected:[10,6]}),true);
});
test('partial drafts replay valid steps and reject impossible or wrong choices',()=>{
  const saved={choices:[1,1,3],selected:[],checked:false};assert.deepEqual(restoreCoins(saved).counts,[0,1,2,1]);
  for(const choices of [[4],[1,1,1],[1,1,3,4,4,4]])assert.throws(()=>restoreCoins({choices,selected:[],checked:false}),RangeError);
  assert.throws(()=>restoreCoins({choices:[],selected:[6],checked:false}),RangeError);
  assert.throws(()=>restoreCoins({choices:[],selected:[],checked:true}),RangeError);
  assert.deepEqual(denominations,[1,3,4]);
});
