export const highpassLevel={id:'ruin-highpass',number:'141',kind:'highpass',name:'紋章の明暗の境目',tag:'高域フィルタと差分',title:'明るさの変化を見つける',story:'遺跡の紋章には明るさの違う石が並んでいます。周囲と中心を比べる術で、変化のある場所を調べましょう。'};
export const highpassCases={flat:{name:'同じ明るさ',pixels:[2,2,2]},bright:{name:'中央が明るい',pixels:[2,6,2]},dark:{name:'中央が暗い',pixels:[6,2,6]}};
export const highpassWeights=[-1,0,1,2];
export const highpassPredictions=[-8,0,8];
export function highpassValue(id,weights){if(!Object.hasOwn(highpassCases,id)||!Array.isArray(weights)||weights.length!==3||weights.some(x=>!highpassWeights.includes(x)))return null;return highpassCases[id].pixels.reduce((sum,value,i)=>sum+value*weights[i],0);}
export function highpassCorrect(id,c){return c.checked&&c.weights.join(',')==='-1,2,-1'&&c.prediction===highpassValue(id,c.weights);}
export function createHighpass(){return {selected:'flat',choices:Object.fromEntries(Object.keys(highpassCases).map(id=>[id,{weights:[null,null,null],prediction:null,checked:false}]))};}
export function restoreHighpass(s){if(!s||!Object.hasOwn(highpassCases,s.selected)||!s.choices)throw new RangeError('途中記録が不正です。');const r=createHighpass();r.selected=s.selected;for(const id of Object.keys(highpassCases)){const c=s.choices[id];if(!c||!Array.isArray(c.weights)||c.weights.length!==3||c.weights.some(x=>x!==null&&!highpassWeights.includes(x))||!(c.prediction===null||highpassPredictions.includes(c.prediction))||typeof c.checked!=='boolean')throw new RangeError('設定が不正です。');r.choices[id]={weights:c.weights.slice(),prediction:c.prediction,checked:c.checked};}return r;}
export function highpassComplete(s){return Object.keys(highpassCases).every(id=>highpassCorrect(id,s.choices[id]));}
