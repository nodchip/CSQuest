import {irisPartition} from './iris-learning.js';
import {irisLogisticFit} from './iris-logistic.js';
export const irisCalibrationLevel={id:'archive-iris-calibration',number:'709',kind:'iris-calibration',name:'花の見込みと実際の割合',tag:'確率の校正と評価',title:'見込みの強さを比べよう',story:'花の鑑定では種類だけでなく、見込みの数字も役立ちます。数字の強さと、実際の記録の割合を照らし合わせましょう。'};
export function irisCalibrationResult(split,temperature){
 if(!['validation','test'].includes(split)||![.5,1,2].includes(temperature))throw new RangeError('比較条件が不正です。');
 const parts=irisPartition(),model=irisLogisticFit(parts.train,0,100),rows=parts[split].map(r=>{const z=model.b+model.w.reduce((sum,w,i)=>sum+w*(r[i]-model.means[i])/model.scales[i],0),p=1/(1+Math.exp(-z/temperature));return {p,label:r[2],prediction:p>=.5?1:0};});
 const bins=Array.from({length:4},(_,index)=>{const group=rows.filter(r=>Math.min(3,Math.floor(r.p*4))===index),count=group.length;return {index,count,mean:count?group.reduce((a,r)=>a+r.p,0)/count:null,positive:count?group.reduce((a,r)=>a+r.label,0):0};});
 const brier=rows.reduce((a,r)=>a+(r.p-r.label)**2,0)/rows.length,loss=rows.reduce((a,r)=>a-Math.log(r.label?r.p:1-r.p),0)/rows.length,correct=rows.filter(r=>r.prediction===r.label).length;
 return {rows,bins,brier,loss,correct,total:rows.length};
}
export function createIrisCalibration(){return {split:'validation',temperature:1,observed:[],answer:null,checked:false};}
export function irisCalibrationComplete(s){return s.checked&&['validation,0.5','validation,1','validation,2','test,0.5','test,1','test,2'].every(k=>s.observed.includes(k))&&s.answer==='probabilities';}
export function restoreIrisCalibration(s){if(!s||!['validation','test'].includes(s.split)||![.5,1,2].includes(s.temperature)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>! /^(validation|test),(0\.5|1|2)$/.test(k))||![null,'probabilities','accuracy','always'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed]};}
