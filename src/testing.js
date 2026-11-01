import {createFaultLab,restoreFaultLab,faultLabComplete} from './fault-lab.js';
export const testingLevel={id:'ward-tests',number:'23',kind:'testing',name:'門を試す魔石',tag:'テスト設計',title:'境界の門を確かめよう',story:'城の門は１人以上５人以下の隊を通す約束です。限られた試験用の魔石を選び、門の作り間違いを見つけましょう。'};
export const sizes=[0,1,2,5,6];
export const implementations={
  correct:{name:'門 A',result:n=>n>=1&&n<=5},
  lower:{name:'門 B',result:n=>n>1&&n<=5},
  upper:{name:'門 C',result:n=>n>=1&&n<=6},
};
export const MAX_CASES=3;
export function createTesting(){return {selected:[],results:null,message:'',lab:createFaultLab()};}
export function toggleCase(state,n){
  if(!sizes.includes(n))throw new RangeError('未知の隊の人数です。');
  if(state.selected.includes(n))return {...state,selected:state.selected.filter(x=>x!==n),results:null,message:`${n} 人の試験を外しました。`};
  if(state.selected.length>=MAX_CASES)return {...state,message:`魔石は ${MAX_CASES} 個までです。外してから選び直しましょう。`};
  return {...state,selected:[...state.selected,n].sort((a,b)=>a-b),results:null,message:`${n} 人の試験を選びました。`};
}
export function runTests(state){
  if(!state.selected.length)return {...state,results:null,message:'まず試験する人数を選びましょう。'};
  const results=state.selected.map(size=>({size,expected:implementations.correct.result(size),actual:Object.fromEntries(Object.entries(implementations).map(([id,gate])=>[id,gate.result(size)]))}));
  return {...state,results,message:'約束の結果と、三つの門の結果を比べましょう。'};
}
export function caught(results,id){return !!results&&results.some(row=>row.actual[id]!==row.expected);}
export function testingComplete(state){return caught(state.results,'lower')&&caught(state.results,'upper')&&faultLabComplete(state.lab);}
export function restoreTesting(saved){
  if(!saved||!Array.isArray(saved.selected)||saved.selected.length>MAX_CASES||saved.selected.some(n=>!sizes.includes(n))||new Set(saved.selected).size!==saved.selected.length||typeof saved.ran!=='boolean'||(saved.ran&&!saved.selected.length))throw new RangeError('途中記録が不正です。');
  let state=createTesting();for(const n of saved.selected)state=toggleCase(state,n);
  state=saved.ran?runTests(state):state;if(saved.lab!==undefined)state.lab=restoreFaultLab(saved.lab);return state;
}
