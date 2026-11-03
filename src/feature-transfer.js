import {deepTrain,deepForward} from './deep-features.js';
export const featureTransferLevel={id:'archive-feature-transfer',number:'1029',kind:'feature-transfer',name:'鑑定鏡の知識を運ぶ',tag:'固定特徴と転移',title:'覚えた特徴を別の依頼へ',story:'鑑定士は以前の二層の鏡を別の依頼にも使います。元の印と鏡の特徴を比べ、どの記録が近いか調べましょう。'};
export const transferViews={raw:'元の２つの印',initial:'訓練前の鏡',trained:'訓練後の鏡'};
export const transferTasks={xor:'２つの印が異なるか',first:'横の印が１か'};
export const transferTests={t01:{name:'横０・縦１',input:[0,1]},t11:{name:'横１・縦１',input:[1,1]}};
const trainInputs=[[0,0],[1,0]];
const label=(task,input)=>task==='xor'?input[0]^input[1]:input[0];
const memo={};
function vector(view,input){if(view==='raw')return [...input];const steps=view==='initial'?0:2000;memo[view]??=deepTrain(steps);return deepForward(memo[view],input).second;}
export function transferResult(view,task,test){
 if(!Object.hasOwn(transferViews,view)||!Object.hasOwn(transferTasks,task)||!Object.hasOwn(transferTests,test))throw new RangeError('条件が不正です。');
 const query=vector(view,transferTests[test].input),training=trainInputs.map(input=>({input,vector:vector(view,input),label:label(task,input)})),distances=training.map(t=>t.vector.reduce((sum,v,i)=>sum+(v-query[i])**2,0)),nearest=distances[0]<=distances[1]?0:1;
 return {query,training,distances,nearest,prediction:training[nearest].label,actual:label(task,transferTests[test].input)};
}
export function transferCreate(){return {view:'raw',task:'xor',test:'t01',guess:null,seen:[],insight:null,leakage:null};}
export function transferCheck(q){if(![0,1].includes(q.guess))throw new RangeError('予測を選びましょう。');const result=transferResult(q.view,q.task,q.test),ok=q.guess===result.prediction,key=`${q.view}:${q.task}:${q.test}`;if(ok&&!q.seen.includes(key))q.seen.push(key);return {...result,ok};}
export function transferComplete(q){return Object.keys(transferViews).every(v=>Object.keys(transferTasks).every(t=>Object.keys(transferTests).every(s=>q.seen.includes(`${v}:${t}:${s}`))))&&q.insight==='depends'&&q.leakage==='pretraining';}
export function transferRestore(q){const keys=Object.keys(transferViews).flatMap(v=>Object.keys(transferTasks).flatMap(t=>Object.keys(transferTests).map(s=>`${v}:${t}:${s}`)));if(!q||!Object.hasOwn(transferViews,q.view)||!Object.hasOwn(transferTasks,q.task)||!Object.hasOwn(transferTests,q.test)||![null,0,1].includes(q.guess)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!keys.includes(k))||![null,'depends','always','same'].includes(q.insight)||![null,'pretraining','unseen','irrelevant'].includes(q.leakage))throw new RangeError('途中記録が不正です。');return {...q,seen:[...q.seen]};}
