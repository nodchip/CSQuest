export const rocCurveLevel={id:'archive-roc-curve',number:'703',kind:'roc-curve',name:'見張りのしきい値と曲線',tag:'ROC 曲線と AUC',title:'警報の境界を動かそう',story:'見張りの水晶は伝令ごとに疑わしさを示します。警報の境界を動かし、見逃しと誤警報の関係を調べましょう。'};
export const rocCases={crossed:[9,7,4,2],tied:[9,5,5,1]};
export const rocThresholds=[10,9,7,5,4,2,1];
export const rocTruth=[true,false,true,false];
export function rocPoint(id,threshold){
 if(!Object.hasOwn(rocCases,id)||!rocThresholds.includes(threshold))throw new RangeError('条件が不正です。');
 const rows=rocCases[id].map((score,i)=>({score,truth:rocTruth[i],alert:score>=threshold}));
 const tp=rows.filter(r=>r.truth&&r.alert).length,fp=rows.filter(r=>!r.truth&&r.alert).length;
 return {rows,tp,fp,fn:2-tp,tn:2-fp,tpr:tp/2,fpr:fp/2};
}
export function rocRanking(id){
 if(!Object.hasOwn(rocCases,id))throw new RangeError('記録が不正です。');
 const pairs=[];for(let i=0;i<4;i++)if(rocTruth[i])for(let j=0;j<4;j++)if(!rocTruth[j]){const positive=rocCases[id][i],negative=rocCases[id][j];pairs.push({positive,negative,credit:positive>negative?1:positive===negative?.5:0});}
 return {pairs,auc:pairs.reduce((sum,p)=>sum+p.credit,0)/pairs.length};
}
export function rocCurvePoints(id){if(!Object.hasOwn(rocCases,id))throw new RangeError('記録が不正です。');return [10,...new Set([...rocCases[id]].sort((a,b)=>b-a))].map(t=>({threshold:t,...rocPoint(id,t)}));}
export function createRocCurve(){return {selected:'crossed',threshold:10,observed:[],answer:null,checked:false};}
export function rocCurveComplete(s){return s.checked&&['crossed,10','crossed,7','crossed,2','tied,10','tied,5','tied,1'].every(k=>s.observed.includes(k))&&s.answer==='ranking';}
export function restoreRocCurve(s){if(!s||!Object.hasOwn(rocCases,s.selected)||!rocThresholds.includes(s.threshold)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>! /^(crossed|tied),(10|9|7|5|4|2|1)$/.test(k))||![null,'ranking','threshold','accuracy'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed]};}
