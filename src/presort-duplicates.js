export const presortLevel={id:'archive-presort-duplicates',number:'694',kind:'presort-duplicates',name:'重なる印と整列の魔法',tag:'事前整列と問題の簡約',title:'重複した印を見つけよう',story:'鑑定士の５枚の札から、同じ数字を探します。すべての組を比べる方法と、並べ直して隣だけを見る方法を試しましょう。'};
export const presortValues=[4,1,3,1,2];
export const presortPairs=Array.from({length:5},(_,i)=>Array.from({length:4-i},(_,j)=>[i,i+j+1])).flat();
export const bubblePairs=Array.from({length:4},(_,pass)=>Array.from({length:4-pass},(_,i)=>[i,i+1])).flat();
export function presortReplay(history){
 if(!Array.isArray(history)||history.length>24)throw new RangeError('記録が不正です。');
 const state={values:[...presortValues],bruteMatches:[],scanMatches:[],swaps:0,last:null};
 for(let k=0;k<history.length;k++){
  const phase=k<10?'brute':k<20?'sort':'scan',pair=phase==='brute'?presortPairs[k]:phase==='sort'?bubblePairs[k-10]:[k-20,k-19];
  const source=phase==='brute'?presortValues:state.values,[i,j]=pair,left=source[i],right=source[j],action=history[k];
  if(phase==='sort'){
   if(action!==(left>right?'swap':'keep'))throw new RangeError('隣の数字を比べ、大きい方を右にしましょう。同じ数字はそのままです。');
   if(action==='swap'){[state.values[i],state.values[j]]=[right,left];state.swaps++;}
  }else{
   if(action!=='compare')throw new RangeError('比較の記録が不正です。');
   if(left===right)(phase==='brute'?state.bruteMatches:state.scanMatches).push(left);
  }
  state.last={phase,pair,left,right,action,equal:left===right};
 }
 const k=history.length;state.phase=k<10?'brute':k<20?'sort':k<24?'scan':'done';
 state.pair=state.phase==='brute'?presortPairs[k]:state.phase==='sort'?bubblePairs[k-10]:state.phase==='scan'?[k-20,k-19]:null;
 state.bruteComparisons=Math.min(k,10);state.sortComparisons=Math.min(Math.max(k-10,0),10);state.scanComparisons=Math.min(Math.max(k-20,0),4);return state;
}
export function createPresort(){return {history:[],answer:null,checked:false};}
export function presortStep(s,action){presortReplay([...s.history,action]);return {...s,history:[...s.history,action],checked:false};}
export function presortComplete(s){return s.checked&&s.answer==='overhead'&&presortReplay(s.history).phase==='done';}
export function restorePresort(s){if(!s||![null,'overhead','free','always'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');presortReplay(s.history);return {history:[...s.history],answer:s.answer,checked:s.checked};}
