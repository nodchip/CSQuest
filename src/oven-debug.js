import {sensorAdapterCases,sensorAdapterEvaluate} from './sensor-adapter.js';
export const ovenDebugLevel={id:'workshop-oven-debug',number:'922',kind:'oven-debug',name:'動かない薬窯',tag:'組込みの原因調査',title:'薬窯の二つの不具合を探る',story:'温度計をつないだ薬窯が、寒くても加熱しません。記録を調べ、問題を切り分けて直しましょう。'};
export function ovenDebugState(history){
 if(!Array.isArray(history)||history.length>7)throw new RangeError('記録が不正です。');
 let phase='initial',irq=false,conversion='half';const traces=[],verified=[];
 for(const a of history){
  if(a==='irq'&&phase==='irq'){irq=true;phase='observe';continue;}
  if(a==='adapter'&&phase==='adapter'){conversion='adapt';phase='verify';continue;}
  if(typeof a!=='string'||!a.startsWith('test:'))throw new RangeError('操作が不正です。');
  const scene=a.slice(5);if(!Object.hasOwn(sensorAdapterCases,scene))throw new RangeError('場面が不正です。');
  if(!((phase==='initial'&&scene==='cold')||(phase==='observe'&&scene==='cold')||(phase==='verify'&&!verified.includes(scene))))throw new RangeError('今は試験できません。');
  const sample=sensorAdapterEvaluate('b',scene,conversion,'stop');
  traces.push({scene,irq,pending:!irq,handler:irq,raw:irq?sample.raw:null,value:irq?sample.value:null,output:irq?sample.output:'off'});
  if(phase==='initial')phase='irq';else if(phase==='observe')phase='adapter';else {verified.push(scene);if(verified.length===3)phase='done';}
 }
 return {phase,irq,conversion,traces,verified,done:phase==='done'};
}
export function ovenDebugCreate(){return {scene:'cold',history:[],reflection:null};}
export function ovenDebugStep(q,action){if(!['irq','adapter','test:cold','test:warm','test:missing'].includes(action))throw new RangeError('操作が不正です。');try{ovenDebugState([...q.history,action]);q.history.push(action);return true;}catch{return false;}}
export function ovenDebugComplete(q){return ovenDebugState(q.history).done&&q.reflection==='layers';}
export function ovenDebugRestore(q){if(!q||!Object.hasOwn(sensorAdapterCases,q.scene)||![null,'layers','single','perfect'].includes(q.reflection))throw new RangeError('記録が不正です。');ovenDebugState(q.history);return {scene:q.scene,history:[...q.history],reflection:q.reflection};}
