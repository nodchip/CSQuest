export const simtLevel={id:'forge-simt-branches',number:'872',kind:'simt-branches',name:'二組の精霊と分かれ道',tag:'GPU の SIMT と分岐',title:'仕事を組み替えて分岐を調べよう',story:'鍛冶場の８人の精霊は、太陽と月の紋章を加工します。４人ずつの組を並べ替え、同じ分岐をまとめたときの仕事を比べましょう。'};
export const simtTasks=[{id:'A',kind:'sun',value:1},{id:'B',kind:'sun',value:2},{id:'C',kind:'moon',value:3},{id:'D',kind:'moon',value:4},{id:'E',kind:'sun',value:5},{id:'F',kind:'sun',value:6},{id:'G',kind:'moon',value:7},{id:'H',kind:'moon',value:8}];
const taskMap=Object.fromEntries(simtTasks.map(t=>[t.id,t]));
export function simtStats(order){
 if(!Array.isArray(order)||order.length!==8||new Set(order).size!==8||order.some(id=>!Object.hasOwn(taskMap,id)))throw new RangeError('並びが不正です。');
 const groups=[order.slice(0,4),order.slice(4,8)].map(ids=>{const tasks=ids.map(id=>taskMap[id]),sun=tasks.filter(t=>t.kind==='sun').map(t=>t.id),moon=tasks.filter(t=>t.kind==='moon').map(t=>t.id);return {ids,sun,moon,passes:Number(sun.length>0)+Number(moon.length>0)};});
 const passes=groups.reduce((sum,g)=>sum+g.passes,0),outputs=Object.fromEntries(simtTasks.map(t=>[t.id,t.kind==='sun'?t.value+1:t.value*2]));
 return {groups,passes,inactive:passes*4-8,outputs};
}
export function simtCreate(){return {order:simtTasks.map(t=>t.id),selected:null,seen:[],last:null,answer:null};}
export function simtSelect(q,index){
 if(!Number.isInteger(index)||index<0||index>=8)throw new RangeError('位置が不正です。');
 if(q.selected===null)q.selected=index;else {const old=q.selected;[q.order[old],q.order[index]]=[q.order[index],q.order[old]];q.selected=null;}
}
export function simtRun(q){const n=simtStats(q.order).passes;if(!q.seen.includes(n))q.seen.push(n);q.last=q.order.join('');}
export function simtComplete(q){return q.seen.includes(4)&&q.seen.includes(2)&&q.answer==='tradeoff';}
export function simtRestore(q){
 if(!q||!(q.selected===null||Number.isInteger(q.selected)&&q.selected>=0&&q.selected<8)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(n=>![2,3,4].includes(n))||!(q.last===null||typeof q.last==='string')||![null,'tradeoff','always','results'].includes(q.answer))throw new RangeError('記録が不正です。');simtStats(q.order);if(q.last!==null)simtStats([...q.last]);return {order:[...q.order],selected:q.selected,seen:[...q.seen],last:q.last,answer:q.answer};
}
