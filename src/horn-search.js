import {edges,places} from './horn-routes.js';

export const hornSearchLevel={id:'ruin-horn-search',number:'148',kind:'horn-search',name:'精霊の道を探し直す',tag:'論理探索とバックトラック',title:'行き止まりから戻ろう',story:'遺跡の道をたどる魔法は、候補が合わなければ戻って別の道を調べます。その探索を手伝いましょう。'};
export const searchCases={star:{name:'星の間を探す',target:'e'},fountain:{name:'泉の間を探す',target:'b'}};
export const candidates=edges.filter(([from])=>from==='a').map(([,to])=>to);
const hasEdge=(a,b)=>edges.some(([x,y])=>x===a&&y===b);
export function createHornSearchTrial(id){if(!Object.hasOwn(searchCases,id))throw new RangeError('問い合わせが不正です。');return {id,phase:'choose',candidate:null,tried:[],solutions:[],history:[],message:'まだ調べていない経由地を選びましょう。'};}
export function stepHornSearch(s,action){
  const n={...s,tried:s.tried.slice(),solutions:s.solutions.slice(),history:s.history.slice()};
  if(s.phase==='choose'&&candidates.includes(action)&&!s.tried.includes(action)){n.candidate=action;n.phase='inspect';n.message=`経由地を${places[action]}に対応させました。次の一歩を確かめましょう。`;}
  else if(s.phase==='inspect'&&action==='inspect'){const success=hasEdge(s.candidate,searchCases[s.id].target);n.tried.push(s.candidate);if(success)n.solutions.push(s.candidate);n.phase='return';n.message=success?`${places[s.candidate]}から目的地へ道があり、答えが見つかりました。`:`${places[s.candidate]}から目的地への一歩の道はありません。`;}
  else if(s.phase==='return'&&action==='backtrack'){n.candidate=null;n.phase='choose';n.message='経由地の対応を戻しました。残る候補を調べましょう。';}
  else if(s.phase==='choose'&&action==='finish'&&s.tried.length===candidates.length){n.phase='done';n.message=s.solutions.length?'候補をすべて調べ、答えを見つけました。':'候補をすべて調べました。この地図の事実からは二歩の道を導けません。';}
  else return {...s,message:'現在の段階と、まだ調べていない候補を確認しましょう。'};
  n.history.push(action);return n;
}
export function createHornSearch(){return {selected:'star',trials:Object.fromEntries(Object.keys(searchCases).map(id=>[id,createHornSearchTrial(id)]))};}
export function hornSearchComplete(s){return Object.keys(searchCases).every(id=>s.trials[id].phase==='done');}
export function restoreHornSearch(saved){if(!saved||!Object.hasOwn(searchCases,saved.selected)||!saved.histories)throw new RangeError('途中記録が不正です。');const s=createHornSearch();s.selected=saved.selected;for(const id of Object.keys(searchCases)){const h=saved.histories[id];if(!Array.isArray(h)||h.length>candidates.length*3+1)throw new RangeError('途中記録が不正です。');for(const action of h){const before=s.trials[id],after=stepHornSearch(before,action);if(after.history.length!==before.history.length+1)throw new RangeError('途中記録が不正です。');s.trials[id]=after;}}return s;}
