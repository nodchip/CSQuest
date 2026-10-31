export const varianceLevel={id:'treasure-variance',number:'84',kind:'variance',name:'ばらつく宝箱の設計',tag:'期待値と分散',title:'同じ平均の宝箱を作ろう',story:'ギルドは４枚の札を持つ宝箱を作ります。１枚ずつ等しい確率で選ばれる札の値を変え、同じ平均で異なるばらつきを作りましょう。'};
export const varianceCases={steady:{name:'確かな箱',variance:0},mixed:{name:'ほどよく広がる箱',variance:5},extreme:{name:'大きく広がる箱',variance:9}};
export function varianceStats(values){
  if(!Array.isArray(values)||values.length!==4||values.some(x=>!Number.isInteger(x)||x<0||x>6))throw new RangeError('札の値が不正です。');
  const mean=values.reduce((a,b)=>a+b,0)/4,squared=values.map(x=>(x-mean)**2),variance=squared.reduce((a,b)=>a+b,0)/4;
  return {mean,squared,variance};
}
export function varianceCorrect(id,trial){if(!Object.hasOwn(varianceCases,id))throw new RangeError('未知の箱です。');const stats=varianceStats(trial.values);return stats.mean===3&&stats.variance===varianceCases[id].variance;}
export function createVariance(){return {selected:'steady',trials:Object.fromEntries(Object.keys(varianceCases).map(id=>[id,{values:[0,0,0,0],slot:0,checked:false}]))};}
export function restoreVariance(saved){
  if(!saved||!Object.hasOwn(varianceCases,saved.selected)||!saved.trials)throw new RangeError('途中記録が不正です。');const result=createVariance();result.selected=saved.selected;
  for(const id of Object.keys(varianceCases)){const t=saved.trials[id];if(!t||!Number.isInteger(t.slot)||t.slot<0||t.slot>3||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');varianceStats(t.values);result.trials[id]={values:t.values.slice(),slot:t.slot,checked:t.checked};}return result;
}
export function varianceComplete(state){return Object.keys(varianceCases).every(id=>state.trials[id].checked&&varianceCorrect(id,state.trials[id]));}
