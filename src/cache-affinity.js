export const cacheAffinityLevel={id:'forge-cache-affinity',number:'624',kind:'cache-affinity',name:'二つの炉と手元の記録',tag:'マルチプロセッサとキャッシュ',title:'仕事を二つの炉に割り振ろう',story:'工房の二つの炉で仕事を再開します。それぞれの炉に残る記録を使いながら、すべてが終わるまでの時間を比べましょう。'};
export const affinityCases={separate:{name:'記録が分かれている',cached:[0,1]},together:{name:'記録が一つの炉に集まる',cached:[0,0]}};
export const affinityAssignments=['00','01','10','11'];
export function cacheAffinitySchedule(id,assignment){
 const scenario=affinityCases[id];if(!scenario||!affinityAssignments.includes(assignment))throw new RangeError('場面か割当てが不正です。');
 const loads=[0,0],jobs=[...assignment].map((x,i)=>{const cpu=Number(x),warm=cpu===scenario.cached[i],duration=warm?2:3,start=loads[cpu];loads[cpu]+=duration;return {cpu,warm,duration,start,end:loads[cpu]};});
 return {jobs,loads,makespan:Math.max(...loads)};
}
export function createCacheAffinity(){return {selected:'separate',assignment:'00',observed:[],best:{separate:null,together:null},answer:null,checked:false};}
export function cacheAffinityComplete(s){return Object.keys(affinityCases).every(id=>affinityAssignments.every(a=>s.observed.includes(`${id}:${a}`))&&affinityAssignments.includes(s.best[id])&&cacheAffinitySchedule(id,s.best[id]).makespan===Math.min(...affinityAssignments.map(a=>cacheAffinitySchedule(id,a).makespan)))&&s.answer==='tradeoff'&&s.checked;}
export function restoreCacheAffinity(s){
 const valid=new Set(Object.keys(affinityCases).flatMap(id=>affinityAssignments.map(a=>`${id}:${a}`)));
 if(!s||!Object.hasOwn(affinityCases,s.selected)||!affinityAssignments.includes(s.assignment)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||!s.best||Object.keys(affinityCases).some(id=>s.best[id]!==null&&!affinityAssignments.includes(s.best[id]))||![null,'tradeoff','always-cache','always-split'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...s,observed:[...s.observed],best:{...s.best}};
}
