export const adiabaticLevel={id:'ruin-adiabatic-lantern',number:'1219',kind:'adiabatic-lantern',name:'静かに変わる二つの門',tag:'断熱量子計算とアニーリング',title:'門の最低エネルギーを追いかけよう',story:'二つの門にかかる重みを少しずつ変え、低い方の門へ精霊を導きます。途中の状態と二つのエネルギーの間隔を調べましょう。'};
export const adiabaticTargets={zero:'０の門を低くする',one:'１の門を低くする'};
export const adiabaticStages=[0,.25,.5,.75,1];
export const adiabaticAnswers={zero:'０が出やすい',equal:'０と１が同じ',one:'１が出やすい'};
export function adiabaticGround(target,s){
 if(!Object.hasOwn(adiabaticTargets,target)||!adiabaticStages.includes(s))throw new RangeError('条件が不正です。');
 const radius=Math.hypot(1-s,s),sign=target==='zero'?1:-1;
 return {ground:-radius,excited:radius,gap:2*radius,p0:(1+sign*s/radius)/2};
}
export function adiabaticCreate(){return {target:'zero',stage:0,answer:null,seen:[],gap:null,reflection:null};}
export function adiabaticCheck(q){const p=adiabaticGround(q.target,q.stage).p0,expected=Math.abs(p-.5)<1e-10?'equal':p>.5?'zero':'one',correct=q.answer===expected,key=`${q.target}:${q.stage}`;if(correct&&!q.seen.includes(key))q.seen.push(key);return {correct,expected};}
export function adiabaticDone(q){return Object.keys(adiabaticTargets).every(t=>adiabaticStages.every(s=>q.seen.includes(`${t}:${s}`)))&&q.gap==='middle'&&q.reflection==='continuous';}
export function adiabaticRestore(q){
 const keys=Object.keys(adiabaticTargets).flatMap(t=>adiabaticStages.map(s=>`${t}:${s}`));
 if(!q||!Object.hasOwn(adiabaticTargets,q.target)||!adiabaticStages.includes(q.stage)||!(q.answer===null||Object.hasOwn(adiabaticAnswers,q.answer))||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!keys.includes(k))||![null,'start','middle','end'].includes(q.gap)||![null,'continuous','guarantee'].includes(q.reflection))throw new RangeError('記録が不正です。');
 return {target:q.target,stage:q.stage,answer:q.answer,seen:[...q.seen],gap:q.gap,reflection:q.reflection};
}
