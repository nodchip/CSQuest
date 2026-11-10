export const moduloWheelCases={positive:[[8]],negative:[[-2]],compare:[[-2,4],[8,4]]};
export function wheelPosition(value){return ((value%5)+5)%5;}
export function replayModuloWheel(kind,history){
 if(!Object.hasOwn(moduloWheelCases,kind)||!Array.isArray(history))return null;
 const cases=moduloWheelCases[kind];let scene=0,index=0,position=0,total=0,results=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===cases.length){if(kind==='compare'&&action==='answer:same'){done=true;continue;}return null;}
  if(action==='reset'){index=0;position=0;total=0;continue;}
  const steps=cases[scene];
  if(index<steps.length){if(action!==`step:${steps[index]}`)return null;total+=steps[index];position=wheelPosition(total);index++;continue;}
  if(action!==`position:${position}`)return null;
  results.push({steps:[...steps],total,position});scene++;index=0;position=0;total=0;if(scene===cases.length&&kind!=='compare')done=true;
 }
 return {scene,index,position,total,results,done};
}
