import {irisPartition} from './iris-learning.js';
export const irisLogisticLevel={id:'archive-iris-logistic',number:'708',kind:'iris-logistic',name:'花の記録と確率の鑑定',tag:'実データとロジスティック回帰',title:'花の見込みを検証しよう',story:'書庫の精霊は、実測された花弁の長さと幅から二種類のアヤメを見分けます。学習の条件を検証し、残した記録で結果を確かめましょう。'};
export const irisLogisticCandidates=[{lambda:0,steps:20},{lambda:0,steps:100},{lambda:.2,steps:20},{lambda:.2,steps:100}];
export function irisLogisticFit(train,lambda,steps){
 if(!Array.isArray(train)||!train.length||![0,.2].includes(lambda)||![20,100].includes(steps)||train.some(r=>!Array.isArray(r)||r.length<3||!Number.isFinite(r[0])||!Number.isFinite(r[1])||![0,1].includes(r[2])))throw new RangeError('手本または設定が不正です。');
 const means=[0,1].map(i=>train.reduce((a,r)=>a+r[i],0)/train.length),scales=[0,1].map(i=>Math.sqrt(train.reduce((a,r)=>a+(r[i]-means[i])**2,0)/train.length));
 if(scales.some(v=>v===0))throw new RangeError('特徴のばらつきがありません。');
 const rows=train.map(r=>({x:[0,1].map(i=>(r[i]-means[i])/scales[i]),y:r[2]}));let w=[0,0],b=0;
 for(let k=0;k<steps;k++){const gradients=[0,0];let gb=0;for(const row of rows){const p=1/(1+Math.exp(-(w[0]*row.x[0]+w[1]*row.x[1]+b))),d=p-row.y;gradients[0]+=d*row.x[0];gradients[1]+=d*row.x[1];gb+=d;}w=w.map((v,i)=>v-.4*(gradients[i]/rows.length+lambda*v));b-=.4*gb/rows.length;}
 return {means,scales,w,b};
}
export function irisLogisticScore(model,rows){
 if(!Array.isArray(rows)||!rows.length)throw new RangeError('評価する記録がありません。');let tp=0,tn=0,fp=0,fn=0,loss=0;
 for(const r of rows){const z=model.b+model.w.reduce((sum,w,i)=>sum+w*(r[i]-model.means[i])/model.scales[i],0),p=1/(1+Math.exp(-z)),pred=p>=.5?1:0;loss-=r[2]?Math.log(p):Math.log(1-p);if(pred&&r[2])tp++;else if(pred)fp++;else if(r[2])fn++;else tn++;}
 return {tp,tn,fp,fn,correct:tp+tn,total:rows.length,loss:loss/rows.length};
}
export function irisLogisticEvaluate(index,split){if(!Number.isInteger(index)||!irisLogisticCandidates[index]||!['validation','test'].includes(split))throw new RangeError('比較条件が不正です。');const p=irisPartition(),candidate=irisLogisticCandidates[index],model=irisLogisticFit(p.train,candidate.lambda,candidate.steps);return {model,...irisLogisticScore(model,p[split])};}
export function irisLogisticBest(index){const score=irisLogisticEvaluate(index,'validation').loss;return irisLogisticCandidates.every((_,i)=>score<=irisLogisticEvaluate(i,'validation').loss+1e-12);}
export function createIrisLogistic(){return {selected:0,seen:0,locked:false,tested:false,answer:null,checked:false};}
export function irisLogisticComplete(s){return s.checked&&s.seen===15&&s.locked&&s.tested&&irisLogisticBest(s.selected)&&s.answer==='limits';}
export function restoreIrisLogistic(s){if(!s||!Number.isInteger(s.selected)||s.selected<0||s.selected>=4||!Number.isInteger(s.seen)||s.seen<0||s.seen>15||typeof s.locked!=='boolean'||typeof s.tested!=='boolean'||![null,'limits','guaranteed','testfit'].includes(s.answer)||typeof s.checked!=='boolean'||(s.locked&&(s.seen!==15||!irisLogisticBest(s.selected)))||(s.tested&&!s.locked))throw new RangeError('途中記録が不正です。');return {...s};}
