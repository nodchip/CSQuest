export const objectCases={
 identity:[
  {initial:[1,2],target:[2,2],requires:['A:charge:ok'],goal:'Ａを１充電し、Ｂはそのままにする。'},
  {initial:[2,1],target:[1,1],requires:['A:use:ok'],goal:'Ａを１消費し、Ｂはそのままにする。'}],
 encapsulation:[
  {initial:[0,1],target:[0,1],requires:['A:direct:blocked','A:use:blocked'],goal:'Ａの直接変更と、残量０での消費を試す。'},
  {initial:[3,1],target:[3,1],requires:['A:direct:blocked','A:charge:blocked'],goal:'Ａの直接変更と、満杯での充電を試す。'}],
 interaction:[
  {initial:[1,0],target:[0,1],requires:['B:use:blocked','A:use:ok','B:charge:ok'],goal:'Ｂの消費を試し、Ａを１消費し、Ｂを１充電する。'},
  {initial:[0,2],target:[0,3],requires:['A:use:blocked','B:charge:ok'],goal:'Ａの消費を試し、Ｂを１充電する。'}]
};
export function replayObjects(kind,history){
 const cases=objectCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,values=[...cases[0].initial],events=[],last='',done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;const task=cases[scene];
  if(action==='reset'){values=[...task.initial];events=[];last='';continue;}
  if(action==='check'){
   if(!values.every((x,i)=>x===task.target[i])||!task.requires.every(x=>events.includes(x))||(kind==='identity'&&events.some(x=>x.startsWith('B:')&&x.endsWith(':ok'))))return null;
   scene++;done=scene===cases.length;if(!done){values=[...cases[scene].initial];events=[];last='';}continue;
  }
  const m=/^act:(A|B):(charge|use|direct)$/.exec(action);if(!m)return null;
  const who=m[1],op=m[2],i=who==='A'?0:1,ok=op==='charge'?values[i]<3:op==='use'?values[i]>0:false;
  if(ok)values[i]+=op==='charge'?1:-1;events.push(`${who}:${op}:${ok?'ok':'blocked'}`);
  last=op==='direct'?`${who}の内部の値は直接変更できません。`:ok?`${who}の${op==='charge'?'充電':'消費'}を行いました。`:`${who}は${op==='charge'?'満杯':'残量０'}なので${op==='charge'?'充電':'消費'}できません。`;
 }
 return {scene,values,events,last,done};
}
