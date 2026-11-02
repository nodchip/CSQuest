export const idleLevel={id:'workshop-idle-energy',number:'858',kind:'idle-energy',name:'眠る水晶と工房の基準',tag:'省電力設定と設計基準',title:'水晶の眠り方を決めよう',story:'工房の水晶は使われない間も灯り続けます。画面と本体の眠る時刻を選び、利用の仕方による電力量の違いを調べましょう。'};
export const idleCases={long:{name:'60分間操作なし',intervals:[60]},interrupt:{name:'20分後に操作し、さらに40分',intervals:[20,40]}};
export const idleDisplay={d15:{name:'15分',minutes:15},d30:{name:'30分',minutes:30},never:{name:'眠らない',minutes:Infinity}};
export const idleSystem={s30:{name:'30分',minutes:30},s60:{name:'60分',minutes:60},never:{name:'眠らない',minutes:Infinity}};
export function idleResult(id,display,system){
 if(!Object.hasOwn(idleCases,id)||!Object.hasOwn(idleDisplay,display)||!Object.hasOwn(idleSystem,system))throw new RangeError('条件が不正です。');
 let awake=0,screen=0,sleep=0;for(const minutes of idleCases[id].intervals){const a=Math.min(minutes,idleSystem[system].minutes);awake+=a;screen+=Math.min(a,idleDisplay[display].minutes);sleep+=minutes-a;}
 const wattMinutes=30*awake+10*screen+2*sleep;return {awake,screen,sleep,wattMinutes,wh:wattMinutes/60,timeoutSubset:idleDisplay[display].minutes<=15&&idleSystem[system].minutes<=30};
}
export function idleCreate(){return {selected:'long',display:'never',system:'never',runs:[],answer:null};}
export function idleRun(q){const key=`${q.selected}:${q.display}:${q.system}`;idleResult(q.selected,q.display,q.system);if(!q.runs.includes(key))q.runs.push(key);}
export function idleComplete(q){return Object.keys(idleCases).every(id=>q.runs.includes(`${id}:never:never`)&&q.runs.includes(`${id}:d15:s30`))&&q.answer==='scope';}
export function idleRestore(q){
 if(!q||!Object.hasOwn(idleCases,q.selected)||!Object.hasOwn(idleDisplay,q.display)||!Object.hasOwn(idleSystem,q.system)||!Array.isArray(q.runs)||q.runs.length>18||new Set(q.runs).size!==q.runs.length||![null,'scope','certificate','zero'].includes(q.answer))throw new RangeError('記録が不正です。');
 for(const key of q.runs){if(typeof key!=='string')throw new RangeError('試行が不正です。');const parts=key.split(':');if(parts.length!==3)throw new RangeError('試行が不正です。');idleResult(...parts);}
 return {selected:q.selected,display:q.display,system:q.system,runs:[...q.runs],answer:q.answer};
}
