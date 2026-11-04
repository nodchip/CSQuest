export const slitLevel={id:'ruin-double-slit',number:'1214',kind:'double-slit',name:'二つの隙間と光の壁',tag:'二重スリットと干渉',title:'光の壁の模様を調べよう',story:'遺跡の光の壁に不思議な模様が現れます。二つの隙間と道の印を使い、模様が変わる理由を探しましょう。'};
export const slitModes={plain:'両方の隙間・印なし',phase:'片方の道の位相を反転',marked:'両方の隙間・道を区別する印'};
export const slitAnswers={middle:'中央の２区画に集まる',outer:'外側の２区画に集まる',equal:'４区画に等しく分かれる'};
// Four orthogonal-output bins: each slit alone has probabilities 1/4 in each bin.
// The second path has opposite phase in the outer bins. The two path states are orthogonal.
const a=[1,1,1,1],b=[-1,1,1,-1];
export function slitDistribution(mode){
 if(!Object.hasOwn(slitModes,mode))throw new RangeError('条件が不正です。');
 return a.map((x,i)=>mode==='marked'?(x*x+b[i]*b[i])/8:(x+(mode==='phase'?-b[i]:b[i]))**2/8);
}
export function slitExpected(mode){if(!Object.hasOwn(slitModes,mode))throw new RangeError('条件が不正です。');return {plain:'middle',phase:'outer',marked:'equal'}[mode];}
export function slitCreate(){return {mode:'plain',answer:null,seen:[],reflection:null};}
export function slitCheck(q){const ok=q.answer===slitExpected(q.mode);if(ok&&!q.seen.includes(q.mode))q.seen.push(q.mode);return ok;}
export function slitDone(q){return Object.keys(slitModes).every(k=>q.seen.includes(k))&&q.reflection==='probability';}
export function slitRestore(q){
 if(!q||!Object.hasOwn(slitModes,q.mode)||!(q.answer===null||Object.hasOwn(slitAnswers,q.answer))||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(x=>!Object.hasOwn(slitModes,x))||![null,'probability','certain'].includes(q.reflection))throw new RangeError('記録が不正です。');
 return {mode:q.mode,answer:q.answer,seen:[...q.seen],reflection:q.reflection};
}
