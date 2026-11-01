import {encodeCategory} from './category-encoding.js';
export const colorNeighborsLevel={id:'forest-color-neighbors',number:'622',kind:'color-neighbors',name:'分かれ道と色の距離',tag:'符号化と最近傍',title:'色の道しるべを比べよう',story:'霧の森で色の道しるべから進路を推測します。記録の表し方を変え、案内がどう変わるか調べましょう。'};
export const colorNeighborModes={first:'番号１：赤０・青１・緑２',second:'番号２：赤０・青２・緑１',onehot:'３灯：赤・青・緑'};
export const colorNeighborCases={red:'赤の道しるべ',blue:'青の道しるべ'};
export function colorNeighborDistances(mode,query){
 if(!Object.hasOwn(colorNeighborModes,mode)||!Object.hasOwn(colorNeighborCases,query))throw new RangeError('条件が不正です。');
 const v=color=>mode==='onehot'?encodeCategory('zero',color):[{first:{red:0,blue:1,green:2},second:{red:0,blue:2,green:1}}[mode][color]];
 const distance=color=>v(color).reduce((sum,n,i)=>sum+(n-v(query)[i])**2,0),east=distance('blue'),west=distance('green');
 return {east,west,choice:east===west?'hold':east<west?'east':'west'};
}
export function createColorNeighbors(){return {mode:'first',query:'red',choice:null,observed:[],answer:null,checked:false};}
export function colorNeighborsComplete(s){return Object.keys(colorNeighborModes).every(m=>Object.keys(colorNeighborCases).every(q=>s.observed.includes(`${m}:${q}`)))&&s.answer==='limited'&&s.checked;}
export function restoreColorNeighbors(s){const valid=new Set(Object.keys(colorNeighborModes).flatMap(m=>Object.keys(colorNeighborCases).map(q=>`${m}:${q}`)));if(!s||!Object.hasOwn(colorNeighborModes,s.mode)||!Object.hasOwn(colorNeighborCases,s.query)||![null,'east','west','hold'].includes(s.choice)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||![null,'limited','proof','ordinal'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed]};}
