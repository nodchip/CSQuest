import {irisSamples} from './iris-samples.js';
import {irisLearningMethods,irisFit,irisPredict} from './iris-learning.js';
export const irisCrossLevel={id:'archive-iris-cross-validation',number:'551',kind:'iris-cross-validation',name:'花の記録を入れ替えて試す',tag:'交差検証とモデル選択',title:'四つの組を順番に検証しよう',story:'書庫の精霊は、一度の分割だけで方法を選んでよいか気になっています。'};
export function irisCrossPartition(fold){if(!Number.isInteger(fold)||fold<0||fold>=4)throw new RangeError('組が不正です。');const parts={train:[],validation:[],test:[]};irisSamples.forEach((r,i)=>{const rem=(i%50)%5;parts[rem===0?'test':rem===fold+1?'validation':'train'].push(r);});return parts;}
function evaluate(method,train,rows){const model=irisFit(method,train);let correct=0;for(const row of rows)if(irisPredict(model,row)===row[2])correct++;return {correct,total:rows.length};}
export function irisCrossFold(method,fold){const p=irisCrossPartition(fold);return evaluate(method,p.train,p.validation);}
export function irisCrossSummary(method){const scores=Array.from({length:4},(_,i)=>irisCrossFold(method,i));return {scores,correct:scores.reduce((a,r)=>a+r.correct,0),total:scores.reduce((a,r)=>a+r.total,0)};}
export function irisCrossBest(method){const score=irisCrossSummary(method).correct;return irisLearningMethods.every((_,i)=>irisCrossSummary(i).correct<=score);}
export function irisCrossTest(method){const p=irisCrossPartition(0);return evaluate(method,irisSamples.filter((_,i)=>i%5!==0),p.test);}
export function createIrisCross(){return {selected:0,evaluated:[0,0,0,0],locked:false,tested:false,reflection:null,checked:false};}
export function irisCrossComplete(s){return s.evaluated.every(x=>x===15)&&s.locked&&s.tested&&irisCrossBest(s.selected)&&s.reflection==='reuse'&&s.checked;}
export function restoreIrisCross(s){if(!s||!Number.isInteger(s.selected)||s.selected<0||s.selected>=4||!Array.isArray(s.evaluated)||s.evaluated.length!==4||s.evaluated.some(x=>!Number.isInteger(x)||x<0||x>=16)||typeof s.locked!=='boolean'||typeof s.tested!=='boolean'||![null,'reuse','guarantee','testtrain'].includes(s.reflection)||typeof s.checked!=='boolean'||(s.locked&&!s.evaluated.every(x=>x===15))||(s.tested&&!s.locked))throw new RangeError('途中記録が不正です。');return {...s,evaluated:[...s.evaluated]};}
