export const continuousDistributionsLevel={id:'crystal-continuous-distributions',number:'654',kind:'continuous-distributions',name:'三つの連続の泉',tag:'一様・正規・指数分布',title:'泉の形と確率を比べよう',story:'宝石工房には、流れ方の違う三つの泉があります。水面の形と区間の面積を比べ、それぞれの確率を調べましょう。'};
export const continuousModels={uniform:{name:'一様分布',description:'０から４まで一様。期待値２。'},normal:{name:'正規分布',description:'平均２、標準偏差１。左右に裾が伸びる。'},exponential:{name:'指数分布',description:'０以上、率１。期待値１。'}};
export const continuousRanges={left:{name:'０から１',a:0,b:1},right:{name:'２から４',a:2,b:4},point:{name:'２ちょうど',a:2,b:2}};
export const continuousRequired=Object.keys(continuousModels).flatMap(m=>Object.keys(continuousRanges).map(r=>`${m},${r}`));
export function continuousDensity(model,x){
 if(!Object.hasOwn(continuousModels,model)||!Number.isFinite(x))throw new RangeError('密度の設定が不正です。');
 if(model==='uniform')return x>=0&&x<=4?0.25:0;
 if(model==='exponential')return x>=0?Math.exp(-x):0;
 return Math.exp(-((x-2)**2)/2)/Math.sqrt(2*Math.PI);
}
export function continuousCdf(model,x){
 if(!Object.hasOwn(continuousModels,model)||!Number.isFinite(x))throw new RangeError('累積確率の設定が不正です。');
 if(model==='uniform')return Math.max(0,Math.min(1,x/4));
 if(model==='exponential')return x<=0?0:1-Math.exp(-x);
 const z=x-2;if(z>=9)return 1;if(z<=-9)return 0;const limit=Math.abs(z),n=256,h=limit/n;let sum=continuousDensity('normal',2)+continuousDensity('normal',2+limit);
 for(let i=1;i<n;i++)sum+=(i%2?4:2)*continuousDensity('normal',2+i*h);
 return Math.max(0,Math.min(1,0.5+Math.sign(z)*sum*h/3));
}
export function continuousProbability(model,range){if(!Object.hasOwn(continuousRanges,range))throw new RangeError('区間が不正です。');const {a,b}=continuousRanges[range];return continuousCdf(model,b)-continuousCdf(model,a);}
export function continuousSurvivalComparison(model){const after1=1-continuousCdf(model,1),after2=1-continuousCdf(model,2);return {unconditional:after1,conditional:after2/after1};}
export function createContinuousDistributions(){return {model:'uniform',range:'left',observed:[],negative:null,point:null,memory:null,checked:false};}
export function continuousDistributionsComplete(s){return continuousRequired.every(k=>s.observed.includes(k))&&s.negative==='normal'&&s.point==='zero'&&s.memory==='exponential'&&s.checked;}
export function restoreContinuousDistributions(s){
 const valid=new Set(continuousRequired);if(!s||!Object.hasOwn(continuousModels,s.model)||!Object.hasOwn(continuousRanges,s.range)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||![null,'normal','uniform','exponential'].includes(s.negative)||![null,'zero','height','one'].includes(s.point)||![null,'exponential','uniform','normal'].includes(s.memory)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed]};
}
