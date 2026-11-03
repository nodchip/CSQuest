export const replicaTradeoffLevel={id:'forge-fault-tradeoff',number:'1077',kind:'replica-tradeoff',name:'二つの宝石庫と書き込み',tag:'障害耐性と性能',title:'宝石庫の書き込み方を選ぶ',story:'工房の記録を守るため、障害時に成功を返す条件と、待つ時間を比べましょう。'};
export const replicaStrategies={single:'Aだけに書く',strict:'AとBの両方を待つ',degraded:'稼働中の全てを待つ'};
export const replicaFaults={none:'故障なし',A:'Aが停止',B:'Bが停止',both:'AとBが停止'};
export const replicaRequired=['single:none','single:A','strict:none','strict:B','degraded:none','degraded:A','degraded:B','degraded:both'];
export function replicaEvaluate(strategy,fault){
 if(!Object.hasOwn(replicaStrategies,strategy)||!Object.hasOwn(replicaFaults,fault))throw new RangeError('条件が不正です');
 const a=fault!=='A'&&fault!=='both',b=fault!=='B'&&fault!=='both';
 const writes=[];if(a)writes.push({node:'A',time:2});if(strategy!=='single'&&b)writes.push({node:'B',time:4});
 const success=strategy==='single'?a:strategy==='strict'?a&&b:a||b;
 return {writes,copies:writes.length,time:success?Math.max(...writes.map(x=>x.time)):null};
}
export function replicaCreate(){return {strategy:'single',fault:'none',guess:null,seen:[],reflection:null,backup:null};}
export function replicaRestore(q){
 if(!q||!Object.hasOwn(replicaStrategies,q.strategy)||!Object.hasOwn(replicaFaults,q.fault)||![null,'2','4','none'].includes(q.guess)||!Array.isArray(q.seen)||q.seen.length>12||new Set(q.seen).size!==q.seen.length||q.seen.some(x=>typeof x!=='string'||!Object.keys(replicaStrategies).some(s=>Object.keys(replicaFaults).some(f=>x===`${s}:${f}`)))||![null,'risk','safe'].includes(q.reflection)||![null,'backup','copies'].includes(q.backup))throw new RangeError('記録が不正です');
 return {...q,seen:[...q.seen]};
}
export function replicaDone(q){return replicaRequired.every(x=>q.seen.includes(x))&&q.reflection==='risk'&&q.backup==='backup';}
