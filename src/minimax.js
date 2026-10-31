export const minimaxLevel={id:'guardian-strategy',number:'44',kind:'minimax',name:'守護者との読み合い',tag:'ミニマックス',title:'二手先の宝を守れ',story:'守護者との試練です。冒険者が道を選んだ後、守護者は冒険者に渡す宝石が最も少なくなる扉を開きます。'};
export const minimaxCases={
  first:{name:'第一の試練',east:[2,8],west:[4,5]},
  second:{name:'第二の試練',east:[3,7],west:[1,9]}
};
export const branches={east:'東の道',west:'西の道'};
export function minimaxValue(id){
  if(!Object.hasOwn(minimaxCases,id))throw new RangeError('未知の試練です。');
  const task=minimaxCases[id],east=Math.min(...task.east),west=Math.min(...task.west);
  return {east,west,best:east>west?'east':'west',guaranteed:Math.max(east,west)};
}
export function checkMinimax(id,choice){const value=minimaxValue(id);return {east:choice.east===value.east,west:choice.west===value.west,best:choice.best===value.best};}
export function createMinimax(){return {selected:'first',choices:Object.fromEntries(Object.keys(minimaxCases).map(id=>[id,{east:null,west:null,best:'',tested:false}]))};}
export function restoreMinimax(saved){
  if(!saved||!Object.hasOwn(minimaxCases,saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');
  const state=createMinimax();state.selected=saved.selected;
  for(const [id,task] of Object.entries(minimaxCases)){
    const c=saved.choices[id];if(!c||!(c.east===null||task.east.includes(c.east))||!(c.west===null||task.west.includes(c.west))||!['','east','west'].includes(c.best)||typeof c.tested!=='boolean')throw new RangeError('途中記録が不正です。');
    state.choices[id]={east:c.east,west:c.west,best:c.best,tested:c.tested};
  }return state;
}
export function minimaxComplete(state){return Object.keys(minimaxCases).every(id=>{const c=state.choices[id],r=checkMinimax(id,c);return c.tested&&r.east&&r.west&&r.best;});}
