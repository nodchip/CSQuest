export const latencyBottleneckLevel={id:'forge-latency-bottlenecks',number:'1053',kind:'latency-bottlenecks',name:'三つの工房の遅れ',tag:'計算・帯域・遅延',title:'どの道具を改良する？',story:'鉱石の工房では依頼によって待ちの原因が違います。同じ予算で１つの道具を改良し、最も早く作業を終えましょう。'};
export const latencyJobs={compute:{name:'計算の多い宝石',compute:12,transfer:2,wait:1},bandwidth:{name:'荷物の多い宝石',compute:2,transfer:12,wait:1},latency:{name:'返事待ちの宝石',compute:2,transfer:2,wait:12}};
export const latencyUpgrades={compute:'計算を２倍速く',bandwidth:'転送帯域を２倍に',latency:'固定の返事待ちを半分に'};
export function latencyResult(job,upgrade){
 if(!Object.hasOwn(latencyJobs,job)||!(upgrade==='none'||Object.hasOwn(latencyUpgrades,upgrade)))throw new RangeError('計画が不正です。');
 const x=latencyJobs[job],compute=x.compute/(upgrade==='compute'?2:1),transfer=x.transfer/(upgrade==='bandwidth'?2:1),wait=x.wait/(upgrade==='latency'?2:1);
 return {compute,transfer,wait,total:compute+transfer+wait};
}
export function latencyCreate(){return {job:'compute',upgrade:'compute',seen:[],answers:{compute:null,bandwidth:null,latency:null},reflection:null};}
export function latencyReady(q){return Object.keys(latencyJobs).every(j=>Object.keys(latencyUpgrades).every(u=>q.seen.includes(`${j}:${u}`)));}
export function latencyDone(q){return latencyReady(q)&&Object.keys(latencyJobs).every(j=>q.answers[j]===j)&&q.reflection==='measure';}
export function latencyRestore(q){
 const jobs=Object.keys(latencyJobs),upgrades=Object.keys(latencyUpgrades),valid=jobs.flatMap(j=>upgrades.map(u=>`${j}:${u}`));
 if(!q||!jobs.includes(q.job)||!upgrades.includes(q.upgrade)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(x=>!valid.includes(x))||!q.answers||jobs.some(j=>![null,...upgrades].includes(q.answers[j]))||![null,'measure','always','bandwidth'].includes(q.reflection))throw new RangeError('途中記録が不正です。');
 return {job:q.job,upgrade:q.upgrade,seen:[...q.seen],answers:Object.fromEntries(jobs.map(j=>[j,q.answers[j]])),reflection:q.reflection};
}
