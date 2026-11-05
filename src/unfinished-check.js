export const unfinishedModes={static:'実行前の門',dynamic:'使う時の門'};
export const unfinishedStates={hole:'未完成',ready:'完成'};
export const unfinishedPaths={skip:'呼び出さない',call:'呼び出す'};
export const unfinishedAnswers={blocked:'開始前に止まる',done:'最後まで進む',error:'使用時に止まる'};
export function unfinishedResult(mode,state,path){if(!Object.hasOwn(unfinishedModes,mode)||!Object.hasOwn(unfinishedStates,state)||!Object.hasOwn(unfinishedPaths,path))throw new RangeError('条件が不正です');if(mode==='static'&&state==='hole')return 'blocked';if(path==='call'&&state==='hole')return 'error';return 'done';}
export function createUnfinished(){return {mode:'static',state:'hole',path:'skip',guess:null,checked:false,seen:[],reflection:null};}
export function restoreUnfinished(s){const keys=Object.keys(unfinishedModes).flatMap(m=>Object.keys(unfinishedStates).flatMap(a=>Object.keys(unfinishedPaths).map(p=>`${m}:${a}:${p}`)));if(!s||!Object.hasOwn(unfinishedModes,s.mode)||!Object.hasOwn(unfinishedStates,s.state)||!Object.hasOwn(unfinishedPaths,s.path)||![null,...Object.keys(unfinishedAnswers)].includes(s.guess)||typeof s.checked!=='boolean'||s.checked&&s.guess===null||!Array.isArray(s.seen)||new Set(s.seen).size!==s.seen.length||!s.seen.every(k=>keys.includes(k))||![null,'scope','static','dynamic'].includes(s.reflection))throw new RangeError('記録が不正です');return {...s,seen:[...s.seen]};}
