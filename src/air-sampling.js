export const airLevel={id:'workshop-air-sampling',number:'859',kind:'air-sampling',name:'森の空気と観測の間隔',tag:'環境監視と欠測',title:'森の空気を見守ろう',story:'森の精霊は、空気が濁る時間を知りたいと頼んでいます。水晶の観測間隔を変え、記録から何が分かるか調べましょう。'};
export const airCases={peaks:{name:'二度の濁り',events:[[2,3],[5,5]],missing:[]},outage:{name:'観測が途切れる日',events:[[4,5]],missing:[4]}};
export const airIntervals=[1,2,4];
export function airResult(id,interval){
 if(!Object.hasOwn(airCases,id)||!airIntervals.includes(interval))throw new RangeError('観測条件が不正です。');
 const c=airCases[id],samples=[];for(let time=0;time<8;time+=interval){const missing=c.missing.includes(time),high=c.events.some(([start,end])=>time>=start&&time<=end);samples.push({time,value:missing?'missing':high?'high':'clear'});}
 return {samples,energy:samples.length*2,detected:c.events.map(([start,end])=>samples.some(s=>s.time>=start&&s.time<=end&&s.value==='high'))};
}
export function airCreate(){return {selected:'peaks',interval:1,runs:[],answer:null};}
export function airRun(q){airResult(q.selected,q.interval);const key=`${q.selected}:${q.interval}`;if(!q.runs.includes(key))q.runs.push(key);}
export function airComplete(q){return Object.keys(airCases).every(id=>airIntervals.every(interval=>q.runs.includes(`${id}:${interval}`)))&&q.answer==='limits';}
export function airRestore(q){
 if(!q||!Object.hasOwn(airCases,q.selected)||!airIntervals.includes(q.interval)||!Array.isArray(q.runs)||q.runs.length>6||new Set(q.runs).size!==q.runs.length||![null,'limits','clear','regulatory'].includes(q.answer))throw new RangeError('記録が不正です。');
 for(const key of q.runs){if(typeof key!=='string'||!/^(peaks|outage):[124]$/.test(key))throw new RangeError('試行が不正です。');const [id,interval]=key.split(':');airResult(id,Number(interval));}
 return {selected:q.selected,interval:q.interval,runs:[...q.runs],answer:q.answer};
}
