export const scalingLevel={id:'parallel-workshop',number:'66',kind:'scaling',name:'精霊を増やしたら',tag:'並列化と限界',title:'工房の仕事を分けよう',story:'魔石の箱を仕上げる工房に、手伝いの精霊が集まりました。人数を増やすと仕事はどのくらい早く終わるでしょう。'};
export const scalingCases={quick:{name:'準備が短い仕事',serial:4,parallel:8},long:{name:'準備が長い仕事',serial:8,parallel:8}};
export const workerCounts=[1,2,4,8];
export const timeOptions=[5,6,8,9,10,12,16];
export function scalingTime(id,workers){if(!Object.hasOwn(scalingCases,id)||!workerCounts.includes(workers))throw new RangeError('未知の条件です。');const task=scalingCases[id];return task.serial+task.parallel/workers;}
export function createScaling(){return {selected:'quick',workers:1,trials:Object.fromEntries(Object.keys(scalingCases).map(id=>[id,Object.fromEntries(workerCounts.map(n=>[n,{prediction:null,tested:false}]))]))};}
export function restoreScaling(saved){
  if(!saved||!Object.hasOwn(scalingCases,saved.selected)||!workerCounts.includes(saved.workers)||!saved.trials)throw new RangeError('途中記録が不正です。');const state=createScaling();state.selected=saved.selected;state.workers=saved.workers;
  for(const id of Object.keys(scalingCases))for(const n of workerCounts){const item=saved.trials[id]?.[n];if(!item||![null,...timeOptions].includes(item.prediction)||typeof item.tested!=='boolean')throw new RangeError('途中記録が不正です。');state.trials[id][n]={prediction:item.prediction,tested:item.tested};}return state;
}
export function scalingComplete(state){return Object.keys(scalingCases).every(id=>workerCounts.every(n=>{const trial=state.trials[id][n];return trial.tested&&trial.prediction===scalingTime(id,n);}));}
