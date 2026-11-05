export const copyModes={value:'値渡し',reference:'参照渡し',restore:'値結果渡し'};
export const copyTargets={separate:'別々の箱（X と Y）',alias:'同じ箱（X と X）'};
export const copyOrders={ab:'A、次に B',ba:'B、次に A'};
export const copyValues=[2,3,4,6,8];
export function copyExperiment(mode,target,order){
 if(!Object.hasOwn(copyModes,mode)||!Object.hasOwn(copyTargets,target)||!Object.hasOwn(copyOrders,order))throw new RangeError('条件が不正です');
 let x=2,y=4,a=2,b=target==='alias'?2:4;
 if(mode==='reference'){x+=1;if(target==='alias')x*=2;else y*=2;a=x;b=target==='alias'?x:y;}else{a+=1;b*=2;}
 const during=x;
 if(mode==='restore'){for(const key of order==='ab'?['a','b']:['b','a']){if(key==='a')x=a;else if(target==='alias')x=b;else y=b;}}
 return {during,after:x,other:target==='alias'?null:y,a,b};
}
export function copyCreate(){return {mode:'restore',target:'alias',order:'ab',during:null,after:null,checked:false,seen:[]};}
export function copyRestore(s){const keys=Object.keys(copyModes).flatMap(m=>Object.keys(copyTargets).flatMap(t=>Object.keys(copyOrders).map(o=>`${m}:${t}:${o}`)));if(!s||!Object.hasOwn(copyModes,s.mode)||!Object.hasOwn(copyTargets,s.target)||!Object.hasOwn(copyOrders,s.order)||![null,...copyValues].includes(s.during)||![null,...copyValues].includes(s.after)||typeof s.checked!=='boolean'||s.checked&&(s.during===null||s.after===null)||!Array.isArray(s.seen)||new Set(s.seen).size!==s.seen.length||!s.seen.every(k=>keys.includes(k)))throw new RangeError('記録が不正です');return {...s,seen:[...s.seen]};}
