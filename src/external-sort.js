import {createExternalBudget,externalBudgetComplete,restoreExternalBudget} from './external-budget.js';
export const externalSortLevel={id:'archive-external-sort',number:'665',kind:'external-sort',name:'頁を運ぶ整列の工房',tag:'外部整列と入出力',title:'限られた机で札を並べよう',story:'書庫の８枚の札は机に一度に載りません。小さく整列した列を作り、先頭を比べて大きな列へ合わせましょう。'};
export const externalItems=[7,2,6,1,8,3,5,4];
export const externalBuffers={small:3,large:4};
export function createExternalTrial(mode){if(!Object.hasOwn(externalBuffers,mode))throw new RangeError('机が不正です。');return {mode,phase:'initial',cursor:0,runs:[],group:0,offsets:[],output:[],nextRuns:[],mergePasses:0,reads:0,writes:0,history:[]};}
export function externalHeads(s){if(s.phase!=='merge')return [];return s.offsets.map((offset,i)=>s.runs[s.group+i][offset]??null);}
export function externalTrialAct(s,action){
 if(!s||s.history.length>=64||s.phase==='done')return {ok:false,message:'この机の作業は終わっています。必要ならやり直しましょう。'};
 const n={...s,runs:s.runs.map(a=>[...a]),offsets:[...s.offsets],output:[...s.output],nextRuns:s.nextRuns.map(a=>[...a]),history:[...s.history]};let message='';
 if(action==='sort'&&s.phase==='initial'){
  const size=externalBuffers[s.mode],chunk=externalItems.slice(s.cursor,s.cursor+size);n.cursor+=chunk.length;n.reads+=chunk.length;n.writes+=chunk.length;n.runs.push(chunk.slice().sort((a,b)=>a-b));message=`${chunk.length} 頁を読み、机で整列して ${chunk.length} 頁を書きました。`;
  if(n.cursor===externalItems.length){n.phase='merge';n.group=0;n.offsets=Array(Math.min(size-1,n.runs.length)).fill(0);message+=' 初めの列がそろいました。';}
 }
 else if(action.startsWith('take:')&&s.phase==='merge'){
  const raw=action.slice(5),index=Number(raw),heads=externalHeads(s);if(String(index)!==raw||!Number.isInteger(index)||index<0||index>=heads.length||heads[index]===null)return {ok:false,message:'残っている列の先頭を選びましょう。'};
  if(heads[index]!==Math.min(...heads.filter(x=>x!==null)))return {ok:false,message:'各列の先頭を比べ、一番小さい札を選びましょう。'};
  const value=heads[index];n.offsets[index]++;n.output.push(value);n.reads++;n.writes++;message=`${value} を読み、併合した列へ書きました。`;
  if(n.offsets.every((offset,i)=>offset===n.runs[n.group+i].length)){
   n.nextRuns.push(n.output);n.output=[];n.group+=n.offsets.length;
   if(n.group<n.runs.length){n.offsets=Array(Math.min(externalBuffers[s.mode]-1,n.runs.length-n.group)).fill(0);message+=' 次の列の組へ進みます。';}
   else{n.runs=n.nextRuns;n.nextRuns=[];n.group=0;n.mergePasses++;if(n.runs.length===1){n.phase='done';n.offsets=[];message+=' 全頁が１列になりました。';}else{n.offsets=Array(Math.min(externalBuffers[s.mode]-1,n.runs.length)).fill(0);message+=' 次の併合の回へ進みます。';}}
  }
 }
 else return {ok:false,message:'今の段階でできる操作を選びましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function createExternalSort(){return {selected:'small',trials:{small:createExternalTrial('small'),large:createExternalTrial('large')},answer:null,checked:false,budget:createExternalBudget()};}
export function externalSortComplete(s){return Object.keys(externalBuffers).every(k=>s.trials[k].phase==='done')&&s.answer==='buffers'&&s.checked&&externalBudgetComplete(s.budget);}
export function restoreExternalSort(saved){if(!saved||!Object.hasOwn(externalBuffers,saved.selected)||!saved.trials||![null,'buffers','always','none'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');const n=createExternalSort();n.selected=saved.selected;n.answer=saved.answer;n.checked=saved.checked;for(const mode of Object.keys(externalBuffers)){const h=saved.trials[mode]?.history;if(!Array.isArray(h)||h.length>64)throw new RangeError('途中記録が不正です。');for(const action of h){if(typeof action!=='string')throw new RangeError('途中記録が不正です。');const r=externalTrialAct(n.trials[mode],action);if(!r.ok)throw new RangeError('途中記録が不正です。');n.trials[mode]=r.state;}}if(saved.budget!==undefined)n.budget=restoreExternalBudget(saved.budget);return n;}
