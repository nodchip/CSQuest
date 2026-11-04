export const sharedSpaceLevel={id:'workshop-shared-space',number:'1273',kind:'shared-space',name:'人形と分け合う通路',tag:'人とロボットの共同空間',title:'近づく前に止まれる？',story:'工房の人形と職人が同じ通路を使います。距離と速さを変え、停止の合図から止まるまでを調べましょう。'};
export const sharedDistances=[4,6,7];
export const sharedSpeeds=[1,2];
export const sharedRequired=['4:1','4:2','6:2','7:2'];
export function sharedTrace(distance,speed){
 if(!sharedDistances.includes(distance)||!sharedSpeeds.includes(speed))throw new RangeError('条件が不正です。');
 let gap=distance,collision=false;const rows=[];
 // One tick of response, then one unit of speed lost per braking tick.
 const movements=[speed,...Array.from({length:speed},(_,i)=>speed-1-i)];
 for(let i=0;i<movements.length;i++){gap-=1+movements[i];collision ||= gap<=0;rows.push({phase:i===0?'反応':'制動',robot:movements[i],human:1,gap,collision});}
 return {rows,collision};
}
export function sharedCreate(){return {distance:4,speed:1,guess:null,seen:[],reflection:null};}
export function sharedCheck(q){if(!['contact','clear'].includes(q.guess))return null;const result=sharedTrace(q.distance,q.speed),ok=(q.guess==='contact')===result.collision,key=`${q.distance}:${q.speed}`;if(ok&&!q.seen.includes(key))q.seen.push(key);return {...result,ok};}
export function sharedDone(q){return sharedRequired.every(k=>q.seen.includes(k))&&q.reflection==='limits';}
export function sharedRestore(q){if(!q||!sharedDistances.includes(q.distance)||!sharedSpeeds.includes(q.speed)||![null,'contact','clear'].includes(q.guess)||![null,'limits','guarantee'].includes(q.reflection)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!sharedDistances.some(d=>sharedSpeeds.some(s=>k===`${d}:${s}`))))throw new RangeError('記録が不正です。');return {distance:q.distance,speed:q.speed,guess:q.guess,seen:[...q.seen],reflection:q.reflection};}
