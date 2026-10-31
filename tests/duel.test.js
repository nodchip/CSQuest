import test from 'node:test';
import assert from 'node:assert/strict';
import {gameValue,createDuel,duelMove,createDuelSet,restoreDuel,duelComplete} from '../src/duel.js';
function outcomes(state){if(state.winner)return [state.winner];return [1,2].filter(n=>n<=state.stones).flatMap(n=>outcomes(duelMove(state,n)));}
test('minimax values match the independent multiple-of-three strategy',()=>{
  for(let n=0;n<=8;n++)for(const turn of ['player','guardian']){
    const playerWins=turn==='player'?n%3!==0:n%3===0;
    assert.equal(gameValue(n,turn),playerWins?1:-1);
  }
});
test('perfect guardian cannot lose from six, while seven and eight have winning lines',()=>{
  assert.deepEqual([...new Set(outcomes(createDuel('six')))],['guardian']);
  assert.ok(outcomes(createDuel('seven')).includes('player'));assert.ok(outcomes(createDuel('eight')).includes('player'));
  assert.throws(()=>duelMove(createDuel('six'),3),RangeError);
});
test('partial and completed matches restore only legal player moves',()=>{
  const state=restoreDuel({selected:'eight',moves:{seven:[1,2,2],eight:[2,2,2],six:[1,1]}});
  assert.equal(state.states.seven.winner,'player');assert.equal(state.states.eight.winner,'player');assert.equal(state.states.six.winner,'guardian');assert.equal(duelComplete(state),true);
  assert.throws(()=>restoreDuel({selected:'six',moves:{seven:[],eight:[],six:[1,1,1]}}),RangeError);
  assert.equal(duelComplete(createDuelSet()),false);
});
