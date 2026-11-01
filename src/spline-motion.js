export const splineMotionLevel={id:'ruin-spline-motion',number:'634',kind:'spline-motion',name:'灯りをつなぐ曲線',tag:'キーフレームとスプライン',title:'灯りの途中の動きを作ろう',story:'遺跡の灯りの位置を記録した札があります。札の間を二つの方法でつなぎ、途中で柵を越えないか調べましょう。'};
export const splineCases={ramp:{name:'０から１へ動く',points:[0,0,1,1]},plateau:{name:'両端が１',points:[0,1,1,0]}};
export const splineMethods={linear:'両端を直線で結ぶ',catmull:'前後も使うスプライン'};
export const splineSteps=[0,1,2,3,4];
export function splinePosition(id,method,t){
 const c=splineCases[id];if(!c||!Object.hasOwn(splineMethods,method)||typeof t!=='number'||!Number.isFinite(t)||t<0||t>1)throw new RangeError('条件が不正です。');
 const [p0,p1,p2,p3]=c.points;if(method==='linear')return p1+(p2-p1)*t;
 return .5*(2*p1+(p2-p0)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t*t*t);
}
export function createSplineMotion(){return {selected:'ramp',method:'linear',step:0,observed:[],answer:null,checked:false};}
export function splineMotionComplete(s){return Object.keys(splineCases).every(id=>Object.keys(splineMethods).every(m=>[1,2,3].every(t=>s.observed.includes(`${id}:${m}:${t}`))))&&s.answer==='overshoot'&&s.checked;}
export function restoreSplineMotion(s){const valid=new Set(Object.keys(splineCases).flatMap(id=>Object.keys(splineMethods).flatMap(m=>splineSteps.map(t=>`${id}:${m}:${t}`))));if(!s||!Object.hasOwn(splineCases,s.selected)||!Object.hasOwn(splineMethods,s.method)||!splineSteps.includes(s.step)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||![null,'overshoot','bound','same'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed]};}
