export const closuresLevel={id:'multiplier-seals',number:'52',kind:'closures',name:'倍率を覚える封印',tag:'クロージャ',title:'二つの封印を作ろう',story:'工房の装置は、そのとき選んだ倍率を覚える封印を作ります。設定を変えて別の封印を作っても、前の封印がどう働くか確かめましょう。'};
export const closureCases={first:{name:'２倍と３倍の封印',oldFactor:2,newFactor:3,input:4},second:{name:'３倍と１倍の封印',oldFactor:3,newFactor:1,input:3}};
export const factors=[1,2,3];
export const predictions=[3,4,6,8,9,12];
export function makeSeal(factor){
  if(!factors.includes(factor))throw new RangeError('倍率が不正です。');
  // Each call has its own factor parameter binding, retained by the returned function.
  return value=>factor*value;
}
export function createClosureTrial(){return {dial:1,old:null,recent:null,predOld:null,predRecent:null,tested:false};}
export function createClosures(){return {selected:'first',trials:{first:createClosureTrial(),second:createClosureTrial()}};}
export function captureSeal(trial,slot){
  if(!factors.includes(trial.dial)||!['old','recent'].includes(slot)||(slot==='recent'&&trial.old===null))throw new RangeError('封印を作れません。');
  return slot==='old'?{...trial,old:trial.dial,recent:null,predOld:null,predRecent:null,tested:false}:{...trial,recent:trial.dial,predRecent:null,tested:false};
}
export function checkClosures(id,trial){
  if(!Object.hasOwn(closureCases,id))throw new RangeError('未知の試練です。');
  const task=closureCases[id],oldValue=trial.old===null?null:makeSeal(trial.old)(task.input),newValue=trial.recent===null?null:makeSeal(trial.recent)(task.input);
  return {oldFactor:trial.old===task.oldFactor,newFactor:trial.recent===task.newFactor,oldPrediction:oldValue!==null&&trial.predOld===oldValue,newPrediction:newValue!==null&&trial.predRecent===newValue,oldValue,newValue};
}
export function restoreClosures(saved){
  if(!saved||!Object.hasOwn(closureCases,saved.selected)||!saved.trials)throw new RangeError('途中記録が不正です。');
  const state=createClosures();state.selected=saved.selected;
  for(const id of Object.keys(closureCases)){
    const t=saved.trials[id],factorOrNull=n=>n===null||factors.includes(n),predictionOrNull=n=>n===null||predictions.includes(n);
    if(!t||!factors.includes(t.dial)||!factorOrNull(t.old)||!factorOrNull(t.recent)||(t.old===null&&t.recent!==null)||!predictionOrNull(t.predOld)||!predictionOrNull(t.predRecent)||(t.old===null&&t.predOld!==null)||(t.recent===null&&t.predRecent!==null)||typeof t.tested!=='boolean')throw new RangeError('途中記録が不正です。');
    state.trials[id]={dial:t.dial,old:t.old,recent:t.recent,predOld:t.predOld,predRecent:t.predRecent,tested:t.tested};
  }return state;
}
export function closuresComplete(state){return Object.keys(closureCases).every(id=>{const trial=state.trials[id],result=checkClosures(id,trial);return trial.tested&&result.oldFactor&&result.newFactor&&result.oldPrediction&&result.newPrediction;});}
