export const fragmentLevel={id:'ruin-fragment-graph',number:'870',kind:'fragment-graph',name:'灯りを編む色の術式',tag:'フラグメントシェーダー',title:'三つの灯りに合う術式を作ろう',story:'遺跡の三つの石に同じ色の紋章を描きます。光の強さを色に変える術式を組み替え、依頼に合う明るさに調整しましょう。'};
export const fragmentCases={shadow:{name:'影でも少し見せる',target:[20,60,100]},bright:{name:'強い灯りを抑える',target:[20,70,100]},night:{name:'夜の控えめな灯り',target:[20,40,60]}};
export const fragmentAmbients=[0,20],fragmentGains=[4,8,10],fragmentLights=[0,5,10];
export function fragmentResult(ambient,gain,clamp){
 if(!fragmentAmbients.includes(ambient)||!fragmentGains.includes(gain)||typeof clamp!=='boolean')throw new RangeError('術式が不正です。');
 const raw=fragmentLights.map(light=>ambient+gain*light),values=raw.map(x=>clamp?Math.min(100,x):x),rgb=values.map(v=>[240,120,60].map(channel=>Math.max(0,Math.min(255,Math.round(channel*v/100)))));
 return {raw,values,rgb};
}
export function fragmentKey(ambient,gain,clamp){fragmentResult(ambient,gain,clamp);return `${ambient}:${gain}:${clamp?1:0}`;}
function parseKey(key){if(typeof key!=='string'||!/^(0|20):(4|8|10):[01]$/.test(key))throw new RangeError('試行が不正です。');const [a,g,c]=key.split(':').map(Number);return fragmentResult(a,g,!!c);}
export function fragmentCreate(){return {selected:'shadow',ambient:0,gain:10,clamp:false,runs:{shadow:[],bright:[],night:[]},stageAnswer:null,rangeAnswer:null};}
export function fragmentRun(q){const key=fragmentKey(q.ambient,q.gain,q.clamp);if(!q.runs[q.selected].includes(key))q.runs[q.selected].push(key);}
export function fragmentCaseDone(q,id){if(!Object.hasOwn(fragmentCases,id))throw new RangeError('依頼が不正です。');return q.runs[id].some(key=>parseKey(key).values.every((x,i)=>x===fragmentCases[id].target[i]));}
export function fragmentComplete(q){return Object.keys(fragmentCases).every(id=>fragmentCaseDone(q,id))&&q.stageAnswer==='fragment'&&q.rangeAnswer==='limit';}
export function fragmentRestore(q){
 if(!q||!Object.hasOwn(fragmentCases,q.selected)||!q.runs||![null,'fragment','vertex','cpu'].includes(q.stageAnswer)||![null,'limit','same','order'].includes(q.rangeAnswer))throw new RangeError('記録が不正です。');fragmentResult(q.ambient,q.gain,q.clamp);
 const copy=fragmentCreate();copy.selected=q.selected;copy.ambient=q.ambient;copy.gain=q.gain;copy.clamp=q.clamp;copy.stageAnswer=q.stageAnswer;copy.rangeAnswer=q.rangeAnswer;
 for(const id of Object.keys(fragmentCases)){const runs=q.runs[id];if(!Array.isArray(runs)||runs.length>12||new Set(runs).size!==runs.length)throw new RangeError('試行が不正です。');for(const key of runs)parseKey(key);copy.runs[id]=[...runs];}return copy;
}
