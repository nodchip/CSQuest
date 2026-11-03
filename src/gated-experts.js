export const gatedLevel={id:'archive-gated-experts',number:'1160',kind:'gated-experts',name:'二人の案内人と配分の門',tag:'ゲート付きアンサンブル',title:'道ごとに予測を組み合わせる',story:'森・丘・城への旅の時間を二人の案内人が予測します。配分の門を調整し、記録された時間との違いを調べましょう。'};
export const gatedRoutes=[{name:'森',a:2,b:6,actual:3},{name:'丘',a:3,b:7,actual:5},{name:'城',a:4,b:8,actual:7}];
export const gatedWeights=[25,50,75];
export function gatedEvaluate(weights){if(!Array.isArray(weights)||weights.length!==3||weights.some(w=>!gatedWeights.includes(w)))throw new RangeError('配分が不正です');const rows=gatedRoutes.map((r,i)=>{const weight=weights[i]/100,prediction=weight*r.a+(1-weight)*r.b;return {...r,weight:weights[i],prediction,error:Math.abs(prediction-r.actual)};});return {rows,mae:rows.reduce((n,r)=>n+r.error,0)/rows.length};}
export function gatedMarker(weights){const k=weights.join(':');return {'50:50:50':'equal','25:50:75':'reverse','75:50:25':'adaptive'}[k]??null;}
export const gatedMarkers=['equal','reverse','adaptive'];
export function gatedCreate(){return {weights:[50,50,50],seen:[],show:false,reflection:null,checked:false};}
export function gatedDone(q){return gatedMarkers.every(k=>q.seen.includes(k))&&q.reflection==='input'&&q.checked;}
export function gatedRestore(q){if(!q||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!gatedMarkers.includes(k))||typeof q.show!=='boolean'||![null,'input','always'].includes(q.reflection)||typeof q.checked!=='boolean')throw new RangeError('記録が不正です');gatedEvaluate(q.weights);const marker=gatedMarker(q.weights);if(q.show&&marker&&!q.seen.includes(marker))throw new RangeError('記録が不正です');return {...q,weights:[...q.weights],seen:[...q.seen]};}
