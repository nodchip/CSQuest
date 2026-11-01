import {irisPartition, irisFit, irisPredict} from './iris-learning.js';

export const irisCurveLevel={id:'archive-iris-curve',number:'618',kind:'iris-curve',name:'花の学習曲線',tag:'学習曲線と汎化',title:'手本を増やして花を見分けよう',story:'書庫の精霊は、手本の数と選び方が鑑定にどう影響するか調べています。'};
export const irisCurveSizes=[4,8,16,32,60];
export const irisCurveMethods={threshold:'長さの境界',nearest:'長さと幅の１近傍'};
export function irisCurveSubset(order,size){
 if(!['front','back'].includes(order)||!irisCurveSizes.includes(size))throw new RangeError('手本の選び方が不正です。');
 const train=irisPartition().train;
 return [0,1].flatMap(label=>{const rows=train.filter(row=>row[2]===label);return order==='front'?rows.slice(0,size/2):rows.slice(-size/2);});
}
export function evaluateIrisCurve(order,method,size){
 if(!Object.hasOwn(irisCurveMethods,method))throw new RangeError('方法が不正です。');
 const train=irisCurveSubset(order,size),validation=irisPartition().validation,model=irisFit(method==='threshold'?0:2,train);
 const correct=rows=>rows.filter(row=>irisPredict(model,row)===row[2]).length;
 return {train,validation,trainCorrect:correct(train),validationCorrect:correct(validation)};
}
export const irisCurveRequired=[...Object.keys(irisCurveMethods).flatMap(method=>irisCurveSizes.map(size=>`front:${method}:${size}`)),...Object.keys(irisCurveMethods).map(method=>`back:${method}:8`)];
export function createIrisCurve(){return {order:'front',method:'threshold',size:4,observed:[],answer:null,checked:false};}
export function irisCurveComplete(s){return irisCurveRequired.every(key=>s.observed.includes(key))&&s.answer==='limited'&&s.checked;}
export function restoreIrisCurve(s){
 const validKey=key=>{if(typeof key!=='string')return false;const p=key.split(':');return p.length===3&&['front','back'].includes(p[0])&&Object.hasOwn(irisCurveMethods,p[1])&&irisCurveSizes.some(n=>String(n)===p[2]);};
 if(!s||!['front','back'].includes(s.order)||!Object.hasOwn(irisCurveMethods,s.method)||!irisCurveSizes.includes(s.size)||!Array.isArray(s.observed)||s.observed.some(key=>!validKey(key))||new Set(s.observed).size!==s.observed.length||![null,'limited','guarantee','train'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...s,observed:[...s.observed]};
}
