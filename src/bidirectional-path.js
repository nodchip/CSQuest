export const bdLevel={id:'ruin-bidirectional-path',number:'886',kind:'bidirectional-path',name:'両側から結ぶ光の道',tag:'双方向パストレーシング',title:'目と灯りから道をつなごう',story:'遺跡の目印をたどり、目からの道と灯りからの道を結びます。途中に壁があるか調べ、同じ道の数え方も考えましょう。'};
export const bdModes={eye:'目からたどる',both:'両側からつなぐ'};
export function bdReplay(mode,actions){
 if(!Object.hasOwn(bdModes,mode)||!Array.isArray(actions))throw new RangeError('条件が不正です。');let stage='camera',camera=null,partner=null,result=null;
 for(const action of actions){
  if(stage==='camera'&&['camera:A','camera:B'].includes(action)){camera=action.slice(-1);stage='partner';}
  else if(stage==='partner'&&[`${mode==='eye'?'next':'light'}:C`,`${mode==='eye'?'next':'light'}:D`].includes(action)){partner=action.slice(-1);stage='check';}
  else if(stage==='check'&&action==='check'){result=(camera==='A'&&partner==='C')||(camera==='B'&&partner==='D')?'visible':'blocked';stage='done';}
  else throw new RangeError('次に必要な道の操作を確かめましょう。');
 }
 return {stage,camera,partner,result,done:stage==='done'};
}
export function bdWeight(mode){if(mode==='naive')return {weights:[1,1],total:2};if(mode==='balanced')return {weights:[0.5,0.5],total:1};throw new RangeError('重みが不正です。');}
export function bdCreate(){return {mode:'eye',trials:{eye:[],both:[]},seen:[],weight:'naive',weightsSeen:[],visibility:null,weighting:null};}
export function bdAct(q,action){const actions=[...q.trials[q.mode],action],r=bdReplay(q.mode,actions);q.trials[q.mode]=actions;if(r.done){const k=`${q.mode}:${r.result}`;if(!q.seen.includes(k))q.seen.push(k);}}
export function bdCompare(q){bdWeight(q.weight);if(!q.weightsSeen.includes(q.weight))q.weightsSeen.push(q.weight);}
export function bdComplete(q){return ['eye:visible','eye:blocked','both:visible','both:blocked'].every(k=>q.seen.includes(k))&&['naive','balanced'].every(k=>q.weightsSeen.includes(k))&&q.visibility==='test'&&q.weighting==='pdf';}
export function bdRestore(q){if(!q||!Object.hasOwn(bdModes,q.mode)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(x=>!['eye:visible','eye:blocked','both:visible','both:blocked'].includes(x))||!Array.isArray(q.weightsSeen)||new Set(q.weightsSeen).size!==q.weightsSeen.length||q.weightsSeen.some(x=>!['naive','balanced'].includes(x))||![null,'test','always','never'].includes(q.visibility)||![null,'pdf','double','same'].includes(q.weighting))throw new RangeError('記録が不正です。');bdWeight(q.weight);const r=bdCreate();r.mode=q.mode;r.seen=[...q.seen];r.weight=q.weight;r.weightsSeen=[...q.weightsSeen];r.visibility=q.visibility;r.weighting=q.weighting;for(const mode of Object.keys(bdModes)){bdReplay(mode,q.trials?.[mode]);r.trials[mode]=[...q.trials[mode]];}return r;}
