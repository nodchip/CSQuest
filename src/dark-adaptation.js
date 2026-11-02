export const darkAdaptLevel={id:'ruin-dark-adaptation',number:'893',kind:'dark-adaptation',name:'暗い遺跡の灯り',tag:'暗順応',title:'暗い道の光を探そう',story:'まぶしい外から暗い遺跡へ入りました。目が暗さに慣れていく模型を調べ、かすかな灯りを探しましょう。'};
export const darkAdaptTimes=[0,5,15,30];
export const darkAdaptThresholds={cone:[8,4,4,4],rod:[16,12,2,1]};
export const darkAdaptSignals={dim:{label:'弱い灯り：強さ３',strength:3},bright:{label:'強い灯り：強さ６',strength:6}};
export function darkAdaptMeasure(time,signal){const i=darkAdaptTimes.indexOf(time);if(i<0||!Object.hasOwn(darkAdaptSignals,signal))throw new RangeError('条件が不正です。');const cone=darkAdaptThresholds.cone[i],rod=darkAdaptThresholds.rod[i],strength=darkAdaptSignals[signal].strength;return {cone,rod,threshold:Math.min(cone,rod),detected:strength>=Math.min(cone,rod),path:cone<rod?'cone':rod<cone?'rod':'tie'};}
const darkAdaptKeys=darkAdaptTimes.flatMap(t=>Object.keys(darkAdaptSignals).map(s=>`${t}:${s}`));
export function darkAdaptCreate(){return {time:0,signal:'dim',seen:[],last:null,dimAnswer:null,brightAnswer:null,reflection:null};}
export function darkAdaptInspect(q){const key=`${q.time}:${q.signal}`;if(!darkAdaptKeys.includes(key))throw new RangeError('条件が不正です。');if(!q.seen.includes(key))q.seen.push(key);q.last=key;}
export function darkAdaptComplete(q){return darkAdaptKeys.every(k=>q.seen.includes(k))&&q.dimAnswer===15&&q.brightAnswer===5&&q.reflection==='threshold';}
export function darkAdaptRestore(q){if(!q||!darkAdaptTimes.includes(q.time)||!Object.hasOwn(darkAdaptSignals,q.signal)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!darkAdaptKeys.includes(k))||!(q.last===null||q.seen.includes(q.last))||![null,...darkAdaptTimes].includes(q.dimAnswer)||![null,...darkAdaptTimes].includes(q.brightAnswer)||![null,'threshold','fixed','guarantee'].includes(q.reflection))throw new RangeError('記録が不正です。');return {time:q.time,signal:q.signal,seen:[...q.seen],last:q.last,dimAnswer:q.dimAnswer,brightAnswer:q.brightAnswer,reflection:q.reflection};}
