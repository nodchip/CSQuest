export const centerLevel={id:'workshop-data-center-energy',number:'844',kind:'data-center-energy',name:'精霊の計算塔をまとめる',tag:'データセンターとエネルギー',title:'計算塔の灯りを調べよう',story:'村の計算塔では、複数の魔法の仕事を装置に割り当てます。稼働する装置の台数を変え、設備全体のエネルギーを比べましょう。'};
export const centerLoads={small:{name:'仕事４個',jobs:4},large:{name:'仕事８個',jobs:8}};
export const centerServers=[1,2,3,4];
// Fixed one-hour model: one active server can run four equal jobs.
export function centerMeasure(load,servers){
 if(!Object.hasOwn(centerLoads,load)||!centerServers.includes(servers))throw new RangeError('条件が不正です。');
 const jobs=centerLoads[load].jobs,capacity=servers*4;
 if(jobs>capacity)return {feasible:false,capacity};
 const itWh=servers*100+jobs*25,facilityWh=itWh*1.5;
 return {feasible:true,capacity,itWh,facilityWh};
}
export function centerCreate(){return {load:'small',servers:4,trials:Object.fromEntries(Object.keys(centerLoads).flatMap(l=>centerServers.map(n=>[`${l}:${n}`,false]))),answer:null};}
export function centerRun(q){const r=centerMeasure(q.load,q.servers);if(r.feasible)q.trials[`${q.load}:${q.servers}`]=true;return r;}
export function centerComplete(q){return q.answer==='assumptions'&&q.trials['small:1']&&q.trials['small:4']&&q.trials['large:2']&&q.trials['large:4'];}
export function centerRestore(q){
 if(!q||!Object.hasOwn(centerLoads,q.load)||!centerServers.includes(q.servers)||!q.trials||![null,'assumptions','always','pue'].includes(q.answer))throw new RangeError('記録が不正です。');
 const n=centerCreate();n.load=q.load;n.servers=q.servers;n.answer=q.answer;
 for(const l of Object.keys(centerLoads))for(const count of centerServers){const key=`${l}:${count}`,seen=q.trials[key];if(typeof seen!=='boolean'||seen&&!centerMeasure(l,count).feasible)throw new RangeError('記録が不正です。');n.trials[key]=seen;}
 return n;
}
