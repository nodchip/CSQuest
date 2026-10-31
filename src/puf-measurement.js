export const pufLevel={id:'castle-puf-inspection',number:'257',kind:'puf-measurement',name:'紋章石の揺らぎ',tag:'装置の特徴と測定誤差',title:'似た紋章を見分けよう',story:'城の門で紋章石の読み取りを確かめます。'};
export const pufReference='10110010';
export const pufSamples=[
 {id:'same',name:'登録した石・通常',response:'10110010',genuine:true},
 {id:'noisy',name:'登録した石・温度が違う',response:'10110011',genuine:true},
 {id:'near',name:'別の石・似た紋章',response:'10100010',genuine:false},
 {id:'far',name:'別の石・異なる紋章',response:'01010010',genuine:false}
];
export function pufDistance(a,b){if(!/^[01]{8}$/.test(a)||!/^[01]{8}$/.test(b))throw new RangeError('８個の灯りが必要です。');return [...a].filter((v,i)=>v!==b[i]).length;}
export function pufResults(limit){if(![0,1].includes(limit))throw new RangeError('許容数が不正です。');return pufSamples.map(s=>({...s,distance:pufDistance(pufReference,s.response),accepted:pufDistance(pufReference,s.response)<=limit}));}
export function createPuf(){return {limit:0,tested:[],tradeoff:null,checked:false};}
export function pufComplete(s){return s.tested.includes(0)&&s.tested.includes(1)&&s.tradeoff==='both'&&s.checked;}
export function restorePuf(saved){if(!saved||![0,1].includes(saved.limit)||!Array.isArray(saved.tested)||saved.tested.length>2||new Set(saved.tested).size!==saved.tested.length||!saved.tested.every(x=>[0,1].includes(x))||![null,'both','safe'].includes(saved.tradeoff)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {limit:saved.limit,tested:[...saved.tested],tradeoff:saved.tradeoff,checked:saved.checked};}
