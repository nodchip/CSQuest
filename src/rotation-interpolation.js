export const rotationInterpolationLevel={id:'ruin-rotation-interpolation',number:'633',kind:'rotation-interpolation',name:'回る道しるべ',tag:'回転の補間',title:'道しるべの向きをつなごう',story:'遺跡の道しるべが二つの向きの間で回ります。どちら向きに回すと自然につながるか調べましょう。'};
export const rotationCases={wrap:{name:'350° から 10°',start:350,end:10},half:{name:'0° から 180°',start:0,end:180}};
export const rotationMethods={direct:'数値をそのまま結ぶ',shortest:'短い回転を選ぶ'};
export const rotationSteps=[0,1,2,3,4];
export function rotationSample(id,method,step){
 const c=rotationCases[id];if(!c||!Object.hasOwn(rotationMethods,method)||!rotationSteps.includes(step))throw new RangeError('回転条件が不正です。');
 const raw=c.end-c.start,delta=method==='direct'?raw:((raw+180)%360+360)%360-180,unwrapped=c.start+delta*step/4,angle=((unwrapped%360)+360)%360;return {angle,delta,unwrapped};
}
export function createRotationInterpolation(){return {selected:'wrap',method:'direct',step:0,observed:[],answer:null,checked:false};}
export function rotationInterpolationComplete(s){return Object.keys(rotationCases).every(id=>Object.keys(rotationMethods).every(m=>[1,2,3].every(t=>s.observed.includes(`${id}:${m}:${t}`))))&&s.answer==='direction'&&s.checked;}
export function restoreRotationInterpolation(s){const valid=new Set(Object.keys(rotationCases).flatMap(id=>Object.keys(rotationMethods).flatMap(m=>rotationSteps.map(t=>`${id}:${m}:${t}`))));if(!s||!Object.hasOwn(rotationCases,s.selected)||!Object.hasOwn(rotationMethods,s.method)||!rotationSteps.includes(s.step)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||![null,'direction','same','unique'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed]};}
