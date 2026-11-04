export const radiometryLevel={id:'ruin-radiometry',number:'1259',kind:'radiometry',name:'灯りを受ける板',tag:'放射測定',title:'同じ光でも受け取る量は？',story:'遺跡の精霊が、光を受ける板の大きさや向きを変えています。板に届く光の密度と合計を比べましょう。'};
export const radiometryChoices={area:[1,2],cosine:[1,.5],solid:[.25,.5],radiance:[8,4]};
export const radiometryTargets=['1:1:0.25:8','2:1:0.25:8','1:0.5:0.25:8','1:1:0.5:8','1:1:0.25:4'];
export const radiometryAnswers=[.5,1,2,4,8];
export function radiometryKey(q){return [q.area,q.cosine,q.solid,q.radiance].join(':');}
export function radiometryValues(q){for(const k of Object.keys(radiometryChoices))if(!radiometryChoices[k].includes(q[k]))throw new RangeError('光の条件が不正です。');const irradiance=q.radiance*q.cosine*q.solid;return {irradiance,flux:irradiance*q.area};}
export function radiometryCreate(){return {area:1,cosine:1,solid:.25,radiance:8,fluxGuess:null,irradianceGuess:null,seen:[],reflection:null};}
export function radiometryCheck(q){if(q.fluxGuess===null||q.irradianceGuess===null)return null;const v=radiometryValues(q),ok=q.fluxGuess===v.flux&&q.irradianceGuess===v.irradiance,key=radiometryKey(q);if(ok&&radiometryTargets.includes(key)&&!q.seen.includes(key))q.seen.push(key);return {ok,...v};}
export function radiometryDone(q){return radiometryTargets.every(k=>q.seen.includes(k))&&q.reflection==='density';}
export function radiometryRestore(q){if(!q)throw new RangeError('記録が不正です。');radiometryValues(q);if(![null,...radiometryAnswers].includes(q.fluxGuess)||![null,...radiometryAnswers].includes(q.irradianceGuess)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!radiometryTargets.includes(k))||![null,'density','same'].includes(q.reflection))throw new RangeError('記録が不正です。');return {...q,seen:[...q.seen]};}
