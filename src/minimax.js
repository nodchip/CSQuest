export const minimaxLevel={id:'guardian-strategy',number:'44',kind:'minimax',name:'守護者と運命の扉',tag:'ミニマックス・期待値',title:'二手先の宝を守れ',story:'守護者が選ぶ扉と、決められた確率で開く扉を比べ、宝石の行方を予測しましょう。'};
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
export const chanceCases={half:{name:'当たりが２分の１',numerator:1,denominator:2},fifth:{name:'当たりが５分の１',numerator:1,denominator:5}};
export function chanceValue(id){if(!Object.hasOwn(chanceCases,id))throw new RangeError('未知の試練です。');const c=chanceCases[id],east=10*c.numerator/c.denominator,west=4;return {east,west,best:east>west?'east':'west'};}
export function checkChance(id,c){const v=chanceValue(id);return {east:c.east===v.east,best:c.best===v.best};}
export const horizonExample={estimate:{east:8,west:5},terminal:{east:[0,9],west:[4,6]}};
export function horizonValues(){const east=Math.min(...horizonExample.terminal.east),west=Math.min(...horizonExample.terminal.west);return {shallow:horizonExample.estimate.east>horizonExample.estimate.west?'east':'west',east,west,best:east>west?'east':'west'};}
export function createMinimax(){return {selected:'first',choices:Object.fromEntries(Object.keys(minimaxCases).map(id=>[id,{east:null,west:null,best:'',tested:false}])),chanceSelected:'half',chanceChoices:Object.fromEntries(Object.keys(chanceCases).map(id=>[id,{east:null,best:'',tested:false}])),horizon:{shallow:'',east:null,west:null,best:'',shallowChecked:false,deepChecked:false}};}
export function restoreMinimax(saved){
  if(!saved||!Object.hasOwn(minimaxCases,saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');
  const state=createMinimax();state.selected=saved.selected;
  for(const [id,task] of Object.entries(minimaxCases)){
    const c=saved.choices[id];if(!c||!(c.east===null||task.east.includes(c.east))||!(c.west===null||task.west.includes(c.west))||!['','east','west'].includes(c.best)||typeof c.tested!=='boolean')throw new RangeError('途中記録が不正です。');
    state.choices[id]={east:c.east,west:c.west,best:c.best,tested:c.tested};
  }
  if(saved.chanceSelected!==undefined){if(!Object.hasOwn(chanceCases,saved.chanceSelected)||!saved.chanceChoices)throw new RangeError('途中記録が不正です。');state.chanceSelected=saved.chanceSelected;for(const id of Object.keys(chanceCases)){const c=saved.chanceChoices[id];if(!c||![null,2,4,5].includes(c.east)||!['','east','west'].includes(c.best)||typeof c.tested!=='boolean')throw new RangeError('途中記録が不正です。');state.chanceChoices[id]={east:c.east,best:c.best,tested:c.tested};}}
  if(saved.horizon!==undefined){const h=saved.horizon;if(!h||!['','east','west'].includes(h.shallow)||![null,0,4,9].includes(h.east)||![null,0,4,6].includes(h.west)||!['','east','west'].includes(h.best)||typeof h.shallowChecked!=='boolean'||typeof h.deepChecked!=='boolean')throw new RangeError('途中記録が不正です。');state.horizon={shallow:h.shallow,east:h.east,west:h.west,best:h.best,shallowChecked:h.shallowChecked,deepChecked:h.deepChecked};}
  return state;
}
export function minimaxComplete(state){const h=state.horizon,v=horizonValues();return Object.keys(minimaxCases).every(id=>{const c=state.choices[id],r=checkMinimax(id,c);return c.tested&&r.east&&r.west&&r.best;})&&Object.keys(chanceCases).every(id=>{const c=state.chanceChoices[id],r=checkChance(id,c);return c.tested&&r.east&&r.best;})&&h.shallowChecked&&h.deepChecked&&h.shallow===v.shallow&&h.east===v.east&&h.west===v.west&&h.best===v.best;}
