import {createMcts,restoreMcts,mctsComplete} from './mcts.js';
import {createStoneTable,restoreStoneTable,stoneTableComplete} from './stone-tablebase.js';
export const duelLevel={id:'stone-duel',number:'45',kind:'duel',name:'守護者との石取り勝負',tag:'対戦探索',title:'最後の石を取れ',story:'守護者が石取りの勝負を挑んできました。交互に１個か２個を取り、最後の石を取った方が勝ちです。'};
export const duelCases={seven:{name:'７個の試練',stones:7},eight:{name:'８個の試練',stones:8},six:{name:'６個の試練',stones:6}};
export function gameValue(stones,turn){
  if(!Number.isInteger(stones)||stones<0||stones>8||!['player','guardian'].includes(turn))throw new RangeError('対戦状態が不正です。');
  if(stones===0)return turn==='player'?-1:1;
  const other=turn==='player'?'guardian':'player';
  const values=[1,2].filter(n=>n<=stones).map(n=>gameValue(stones-n,other));
  return turn==='player'?Math.max(...values):Math.min(...values);
}
export function createDuel(id){if(!Object.hasOwn(duelCases,id))throw new RangeError('未知の試練です。');return {id,stones:duelCases[id].stones,moves:[],log:[],winner:null};}
export function duelMove(state,amount){
  if(state.winner!==null||![1,2].includes(amount)||amount>state.stones)throw new RangeError('その手は選べません。');
  let stones=state.stones-amount;const moves=[...state.moves,amount],log=[...state.log,`あなたが ${amount} 個取り、残り ${stones} 個。`];
  if(stones===0)return {...state,stones,moves,log,winner:'player'};
  const legal=[1,2].filter(n=>n<=stones),best=Math.min(...legal.map(n=>gameValue(stones-n,'player')));
  const reply=legal.find(n=>gameValue(stones-n,'player')===best);stones-=reply;log.push(`守護者が ${reply} 個取り、残り ${stones} 個。`);
  return {...state,stones,moves,log,winner:stones===0?'guardian':null};
}
export function createDuelSet(){return {selected:'seven',states:Object.fromEntries(Object.keys(duelCases).map(id=>[id,createDuel(id)])),mcts:createMcts(),table:createStoneTable()};}
export function restoreDuel(saved){
  if(!saved||!Object.hasOwn(duelCases,saved.selected)||!saved.moves)throw new RangeError('途中記録が不正です。');
  const state=createDuelSet();state.selected=saved.selected;
  for(const [id,task] of Object.entries(duelCases)){
    const moves=saved.moves[id];if(!Array.isArray(moves)||moves.length>task.stones)throw new RangeError('途中記録が不正です。');
    state.states[id]=moves.reduce(duelMove,createDuel(id));
  }if(saved.mcts!==undefined)state.mcts=restoreMcts(saved.mcts);if(saved.table!==undefined)state.table=restoreStoneTable(saved.table);return state;
}
export function duelComplete(state){return state.states.seven.winner==='player'&&state.states.eight.winner==='player'&&state.states.six.winner==='guardian'&&mctsComplete(state.mcts)&&stoneTableComplete(state.table);}
