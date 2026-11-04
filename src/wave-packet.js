export const waveLevel={id:'ruin-wave-packet',number:'1215',kind:'wave-packet',name:'霧に広がる粒の足あと',tag:'波束と不確定性',title:'位置と運動量の広がりを比べよう',story:'遺跡の精霊は不思議な粒の足あとを霧に記録しています。位置と運動量の広がりを比べましょう。'};
export const waveCases={narrow:{name:'位置を狭く準備',sigma:0.5,answer:'wider'},baseline:{name:'基準の準備',sigma:1,answer:'same'},wide:{name:'位置を広く準備',sigma:2,answer:'narrower'}};
export const waveAnswers={wider:'基準より広い',same:'基準と同じ',narrower:'基準より狭い'};
export function waveWidths(id){if(!Object.hasOwn(waveCases,id))throw new RangeError('準備が不正です。');const x=waveCases[id].sigma;return {x,p:1/(2*x)};}
export function waveDensity(value,sigma){if(!Number.isFinite(value)||!Number.isFinite(sigma)||sigma<=0)throw new RangeError('値が不正です。');return Math.exp(-(value**2)/(2*sigma**2))/(Math.sqrt(2*Math.PI)*sigma);}
export function waveCreate(){return {selected:'baseline',answer:null,seen:[],reflection:null};}
export function waveCheck(q){const ok=q.answer===waveCases[q.selected].answer;if(ok&&!q.seen.includes(q.selected))q.seen.push(q.selected);return ok;}
export function waveDone(q){return Object.keys(waveCases).every(k=>q.seen.includes(k))&&q.reflection==='ensemble';}
export function waveRestore(q){if(!q||!Object.hasOwn(waveCases,q.selected)||!(q.answer===null||Object.hasOwn(waveAnswers,q.answer))||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!Object.hasOwn(waveCases,k))||![null,'ensemble','device'].includes(q.reflection))throw new RangeError('記録が不正です。');return {selected:q.selected,answer:q.answer,seen:[...q.seen],reflection:q.reflection};}
