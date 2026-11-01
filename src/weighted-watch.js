import {ensembleTruth,ensembleVotes} from './watch-ensemble.js';
export const weightedWatchLevel={id:'castle-weighted-watch',number:'700',kind:'weighted-watch',name:'重みを持つ見張りの票',tag:'重み付き多数決',title:'見張りの票の重みを変えよう',story:'王城の３人の見張りに異なる重みを割り当てます。どの判断が変わるか、６通の記録を比べましょう。'};
export function weightedWatchResult(weights){
 if(!Array.isArray(weights)||weights.length!==3||weights.some(w=>!Number.isInteger(w)||w<1||w>3))throw new RangeError('重みは１〜３を３つ選んでください。');
 const votes=ensembleVotes.different,total=weights.reduce((a,b)=>a+b,0);
 const rows=ensembleTruth.map((attack,i)=>{const choices=votes.map(v=>v[i]),alarmWeight=choices.reduce((sum,v,j)=>sum+(v?weights[j]:0),0),passWeight=total-alarmWeight,alert=alarmWeight>passWeight;return {id:i+1,attack,choices,alarmWeight,passWeight,alert,correct:alert===attack};});
 return {rows,correct:rows.filter(r=>r.correct).length,ties:rows.filter(r=>r.alarmWeight===r.passWeight).length};
}
export function createWeightedWatch(){return {weights:[1,1,1],observed:[],answer:null,checked:false};}
export function weightedWatchComplete(s){return s.checked&&['1,1,1','2,1,1','3,1,1'].every(k=>s.observed.includes(k))&&s.answer==='depends';}
export function restoreWeightedWatch(s){
 if(!s||!Array.isArray(s.weights)||s.weights.length!==3||s.weights.some(w=>!Number.isInteger(w)||w<1||w>3)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!/^[1-3],[1-3],[1-3]$/.test(k))||![null,'depends','always','none'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...s,weights:[...s.weights],observed:[...s.observed]};
}
