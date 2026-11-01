import {irisFit,irisPartition,irisPredict} from './iris-learning.js';
export const irisExplanationLevel={id:'archive-iris-explanation',number:'620',kind:'iris-explanation',name:'鑑定の理由をたどる',tag:'モデルの説明と反実仮想',title:'花の鑑定の理由を探ろう',story:'同じ花の記録から、二つの鑑定法が異なる答えを返しました。鑑定士と入力を調べましょう。'};
export const explanationMethods={threshold:'長さの境界',nearest:'長さと幅の１近傍'};
export const explanationInputs={base:{name:'もとの寸法',values:[47,15]},longer:{name:'長さだけ 0.1 cm 増やす',values:[48,15]},wider:{name:'幅だけ 0.5 cm 増やす',values:[47,20]}};
export function explainIris(method,input){
 if(!Object.hasOwn(explanationMethods,method)||!Object.hasOwn(explanationInputs,input))throw new RangeError('条件が不正です。');
 const rows=irisPartition().train,model=irisFit(method==='threshold'?0:2,rows),point=explanationInputs[input].values,prediction=irisPredict(model,point);
 if(method==='threshold')return {prediction,threshold:model.threshold};
 let nearest=null,best=Infinity;for(const row of rows){const distance=(row[0]-point[0])**2+(row[1]-point[1])**2;if(distance<best){best=distance;nearest=row;}}
 return {prediction,neighbor:[...nearest],squaredDistance:best};
}
export function createIrisExplanation(){return {method:'threshold',input:'base',guess:null,observed:[],answer:null,checked:false};}
export function irisExplanationComplete(s){return Object.keys(explanationMethods).every(m=>Object.keys(explanationInputs).every(i=>s.observed.includes(`${m}:${i}`)))&&s.answer==='limited'&&s.checked;}
export function restoreIrisExplanation(s){
 const valid=new Set(Object.keys(explanationMethods).flatMap(m=>Object.keys(explanationInputs).map(i=>`${m}:${i}`)));
 if(!s||!Object.hasOwn(explanationMethods,s.method)||!Object.hasOwn(explanationInputs,s.input)||![null,0,1].includes(s.guess)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||![null,'limited','causal','certain'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...s,observed:[...s.observed]};
}
