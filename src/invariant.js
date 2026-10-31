import {books} from './lookup.js';
export const invariantLevel={id:'search-invariant',number:'69',kind:'invariant',name:'探す本を残す約束',tag:'探索の不変条件',title:'候補の範囲を守ろう',story:'鑑定士が本を半分ずつ探す手順を比べています。探す本が存在するなら候補から消えない、という約束は守られるでしょうか。'};
export const invariantCases={correct:{name:'正しい手順',target:10,bug:false},fault:{name:'一冊飛ばす手順',target:10,bug:true},absent:{name:'存在しない番号',target:11,bug:false}};
export function createInvariant(id){if(!Object.hasOwn(invariantCases,id))throw new RangeError('未知の試練です。');const task=invariantCases[id];return {id,target:task.target,bug:task.bug,lo:0,hi:books.length-1,search:'playing',status:'playing',history:[],message:'現在の候補範囲で約束が成り立つか考えましょう。'};}
export function invariantHolds(state){const index=books.indexOf(state.target);return index===-1||(state.lo<=index&&index<=state.hi);}
export function advanceInvariant(state){
  if(state.search!=='playing')throw new RangeError('探索は終了しています。');const mid=Math.floor((state.lo+state.hi)/2),value=books[mid];
  if(value===state.target)return {...state,search:'found',message:`中央の ${value} が見つかりました。最後の範囲でも約束を確かめましょう。`};
  let lo=state.lo,hi=state.hi;if(value<state.target)lo=mid+(state.bug?2:1);else hi=mid-1;
  return {...state,lo,hi,search:lo>hi?'missing':'playing',message:lo>hi?'候補がなくなりました。最後の範囲でも約束を確かめましょう。':`${value} と探す番号を比べ、候補範囲を更新しました。`};
}
export function invariantStep(state,answer){
  if(state.status!=='playing'||!['holds','broken'].includes(answer))throw new RangeError('操作できません。');const holds=invariantHolds(state);
  if((answer==='holds')!==holds)return {...state,message:books.includes(state.target)?'探す番号が実際にある位置と、現在の候補範囲を比べましょう。':'探す番号が存在しない場合、「存在するなら残る」という約束は破られていません。'};
  const history=[...state.history,answer];if(!holds)return {...state,history,status:'counterexample',message:'探す本があるのに候補から除かれました。約束が破られた具体例です。'};
  if(state.search!=='playing')return {...state,history,status:'done',message:state.search==='found'?'本を見つけ、最後まで約束を確認しました。':'本は存在せず、条件付きの約束は最後まで成り立ちました。'};
  return {...advanceInvariant(state),history};
}
export function createInvariantSet(){return {selected:'correct',states:Object.fromEntries(Object.keys(invariantCases).map(id=>[id,createInvariant(id)]))};}
export function restoreInvariant(saved){
  if(!saved||!Object.hasOwn(invariantCases,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');const result=createInvariantSet();result.selected=saved.selected;
  for(const id of Object.keys(invariantCases)){const history=saved.history[id];if(!Array.isArray(history)||history.length>6)throw new RangeError('途中記録が不正です。');let state=createInvariant(id);for(const answer of history){const next=invariantStep(state,answer);if(next.history.length!==state.history.length+1)throw new RangeError('途中記録が不正です。');state=next;}result.states[id]=state;}return result;
}
export function invariantComplete(value){return Object.keys(invariantCases).every(id=>value.states[id].status!=='playing');}
