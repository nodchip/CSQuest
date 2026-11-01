export const multiprocessorRolesLevel={id:'forge-multiprocessor-roles',number:'626',kind:'multiprocessor-roles',name:'二人の炉番と仕事の指揮',tag:'対称・非対称マルチプロセッシング',title:'炉番の役割を決めよう',story:'二人の炉番で依頼を進めます。片方が指揮する方法と、二人が対等に仕事を選ぶ方法を比べましょう。'};
export const multiCases={small:{name:'１つの仕事',jobs:1,masterAvailable:true},large:{name:'２つの仕事',jobs:2,masterAvailable:true},failure:{name:'２つの仕事・１番が故障',jobs:2,masterAvailable:false}};
export const multiModes={asymmetric:'固定の指揮役（非対称）',symmetric:'対等な炉番（対称）'};
export function multiSchedule(id,mode){
 const c=multiCases[id];if(!c||!Object.hasOwn(multiModes,mode))throw new RangeError('場面か方式が不正です。');
 if(mode==='asymmetric')return c.masterAvailable?{completed:true,time:c.jobs*2,workers:1,setup:0}:{completed:false,time:null,workers:0,setup:0};
 const workers=c.masterAvailable?2:1,setup=1;return {completed:true,time:setup+Math.ceil(c.jobs/workers)*2,workers,setup};
}
export function createMultiprocessorRoles(){return {selected:'small',mode:'asymmetric',observed:[],best:{small:null,large:null,failure:null},answer:null,checked:false};}
export function multiRolesComplete(s){return Object.keys(multiCases).every(id=>Object.keys(multiModes).every(m=>s.observed.includes(`${id}:${m}`))&&Object.hasOwn(multiModes,s.best[id])&&multiSchedule(id,s.best[id]).completed&&Object.keys(multiModes).every(m=>{const r=multiSchedule(id,m);return !r.completed||multiSchedule(id,s.best[id]).time<=r.time;}))&&s.answer==='tradeoff'&&s.checked;}
export function restoreMultiprocessorRoles(s){const valid=new Set(Object.keys(multiCases).flatMap(id=>Object.keys(multiModes).map(m=>`${id}:${m}`)));if(!s||!Object.hasOwn(multiCases,s.selected)||!Object.hasOwn(multiModes,s.mode)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||!s.best||Object.keys(multiCases).some(id=>s.best[id]!==null&&!Object.hasOwn(multiModes,s.best[id]))||![null,'tradeoff','always','failure'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed],best:{...s.best}};}
