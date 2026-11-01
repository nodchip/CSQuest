export const learningAssumptionsLevel={id:'archive-learning-assumptions',number:'706',kind:'learning-assumptions',name:'見えない札と学びの仮定',tag:'学習と仮定・No Free Lunch',title:'手本だけで未来を決められる？',story:'精霊は三つの札のうち二つだけ色を知っています。見えない札を予測する２つの方針と、世界に置く仮定を比べましょう。'};
export function learningAssumptionsResult(first,second,assumption,rule){
 if(![0,1].includes(first)||![0,1].includes(second)||!['any','same','opposite'].includes(assumption)||!['same','opposite'].includes(rule))throw new RangeError('条件が不正です。');
 const prediction=rule==='same'?first:1-first,possible=assumption==='any'?[0,1]:[assumption==='same'?first:1-first],worlds=possible.map(hidden=>({first,second,hidden,prediction,correct:hidden===prediction}));
 return {prediction,worlds,correct:worlds.filter(w=>w.correct).length,total:worlds.length};
}
export function createLearningAssumptions(){return {first:0,second:0,assumption:'any',rule:'same',observed:[],answer:null,checked:false};}
export function learningAssumptionsComplete(s){return s.checked&&['any,same','any,opposite','same,same','same,opposite','opposite,same','opposite,opposite'].every(k=>s.observed.includes(k))&&s.answer==='assumptions';}
export function restoreLearningAssumptions(s){if(!s||![0,1].includes(s.first)||![0,1].includes(s.second)||!['any','same','opposite'].includes(s.assumption)||!['same','opposite'].includes(s.rule)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>! /^(any|same|opposite),(same|opposite)$/.test(k))||![null,'assumptions','universal','guarantee'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed]};}
