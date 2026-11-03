import {bezierAt} from './bezier.js';
export const polynomialBasesLevel={id:'ruin-polynomial-bases',number:'1165',kind:'polynomial-bases',name:'曲線を表す三つの札',tag:'多項式の基底とベジェ曲線',title:'同じ曲線を二つの基底で表す',story:'光の橋の設計図は、同じ曲線を異なる３枚の札で記録できます。札を選び、目標の曲線と一致させましょう。'};
export const pbCases={arch:{name:'光の弧',target:[0,4,-4],bernstein:[0,2,0]},rise:{name:'昇る光',target:[1,2,1],bernstein:[1,2,4]},fall:{name:'降りる光',target:[2,-4,2],bernstein:[2,0,0]}};
export const pbValues=[0,1,2,3,4],pbTimes=[0,0.25,0.5,0.75,1];
export function pbPower(b){if(!Array.isArray(b)||b.length!==3||b.some(v=>!Number.isFinite(v)))throw new RangeError('係数が不正です');return [b[0],2*(b[1]-b[0]),b[0]-2*b[1]+b[2]];}
export function pbEvaluatePower(a,t){if(!Array.isArray(a)||a.length!==3||!a.every(Number.isFinite)||!Number.isFinite(t))throw new RangeError('係数が不正です');return a[0]+a[1]*t+a[2]*t*t;}
export function pbEvaluateBernstein(b,t){if(!Array.isArray(b)||b.length!==3||!b.every(Number.isFinite)||!Number.isFinite(t))throw new RangeError('係数が不正です');return b[0]*(1-t)**2+b[1]*2*t*(1-t)+b[2]*t*t;}
export function pbBridge(height,t){return bezierAt(height,t).point[1];}
export function pbCreate(){return {selected:'arch',b:[0,0,0],seen:[],checked:false,reflection:null,reflectionChecked:false};}
export function pbCorrect(q){return q.checked&&q.b.every((x,i)=>x===pbCases[q.selected].bernstein[i]);}
export function pbDone(q){return Object.keys(pbCases).every(k=>q.seen.includes(k))&&q.reflection==='basis'&&q.reflectionChecked;}
export function pbRestore(q){if(!q||!Object.hasOwn(pbCases,q.selected)||!Array.isArray(q.b)||q.b.length!==3||q.b.some(v=>!pbValues.includes(v))||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!Object.hasOwn(pbCases,k))||typeof q.checked!=='boolean'||![null,'basis','same'].includes(q.reflection)||typeof q.reflectionChecked!=='boolean')throw new RangeError('途中記録が不正です');if(pbCorrect(q)&&!q.seen.includes(q.selected))throw new RangeError('記録が不正です');return {...q,b:[...q.b],seen:[...q.seen]};}
