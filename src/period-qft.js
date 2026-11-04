import {orderExperiment,orderSample} from './quantum-order.js';
export const periodQftLevel={id:'castle-period-qft',number:'1222',kind:'period-qft',name:'周期を映す十六の鏡',tag:'量子フーリエ変換と周期探索',title:'周期の光を測定の山に変えよう',story:'十五の封印を調べるため、十六の鏡に並ぶ光を変換します。周期の異なる二つの紋章を比べ、測定の手がかりを探しましょう。'};
export const periodQftBases=[2,4];
export const periodQftChoices={four:'０・４・８・12',eight:'０・８',zero:'０だけ'};
export function periodQftState(base,offset){
 if(!periodQftBases.includes(base))throw new RangeError('紋章が不正です。');
 const e=orderExperiment(base);if(!Number.isInteger(offset)||offset<0||offset>=e.order)throw new RangeError('測定結果が不正です。');
 const positions=e.powers.flatMap((v,x)=>v===e.powers[offset]?[x]:[]),amp=1/Math.sqrt(positions.length);
 const transformed=Array.from({length:16},(_,y)=>{let re=0,im=0;for(const x of positions){const angle=-2*Math.PI*x*y/16;re+=amp*Math.cos(angle)/4;im+=amp*Math.sin(angle)/4;}return {re,im,p:re*re+im*im};});
 return {base,offset,value:e.powers[offset],order:e.order,positions,transformed};
}
export function periodQftExpected(base){if(!periodQftBases.includes(base))throw new RangeError('紋章が不正です。');return base===2?'four':'eight';}
export function periodQftSample(y){if(![0,4,8,12].includes(y))throw new RangeError('測定値が不正です。');const result=orderSample(2,y),category=y===0?'zero':y===8?'partial':'full';return {...result,category};}
export function periodQftCreate(){return {base:2,offset:0,phase:'ready',prediction:null,seen:[],sample:null,samples:[],reflection:null};}
export function periodQftCheck(q){if(q.phase!=='prepared')throw new RangeError('先に状態を用意してください。');const ok=q.prediction===periodQftExpected(q.base),key=`${q.base}:${q.offset}`;if(ok&&!q.seen.includes(key))q.seen.push(key);return ok;}
export function periodQftSampleCheck(q,y){const result=periodQftSample(y);q.sample=y;if(!q.samples.includes(result.category))q.samples.push(result.category);return result;}
export function periodQftDone(q){return periodQftBases.every(b=>Array.from({length:orderExperiment(b).order},(_,i)=>`${b}:${i}`).every(k=>q.seen.includes(k)))&&['zero','partial','full'].every(k=>q.samples.includes(k))&&q.reflection==='peaks';}
export function periodQftRestore(q){
 const keys=periodQftBases.flatMap(b=>Array.from({length:orderExperiment(b).order},(_,i)=>`${b}:${i}`));
 if(!q||!periodQftBases.includes(q.base)||!Number.isInteger(q.offset)||q.offset<0||q.offset>=orderExperiment(q.base).order||!['ready','prepared','transformed'].includes(q.phase)||!(q.prediction===null||Object.hasOwn(periodQftChoices,q.prediction))||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!keys.includes(k))||![null,0,4,8,12].includes(q.sample)||!Array.isArray(q.samples)||new Set(q.samples).size!==q.samples.length||q.samples.some(k=>!['zero','partial','full'].includes(k))||![null,'peaks','all'].includes(q.reflection))throw new RangeError('記録が不正です。');
 return {base:q.base,offset:q.offset,phase:q.phase,prediction:q.prediction,seen:[...q.seen],sample:q.sample,samples:[...q.samples],reflection:q.reflection};
}
