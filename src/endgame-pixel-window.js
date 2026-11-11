import {kernelAt,kernelFilters} from './image-kernel.js';
const correct={box:'40/9',gaussian:'5',sharp:'24'};
export function replayPixelWindow(kind,history){
 if(!Object.hasOwn(correct,kind)||!Array.isArray(history)||history.length>40)return null;
 const data=kernelAt('noise',kind,12),used=[];let done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){used.length=0;continue;}
  if(action===`answer:${correct[kind]}`&&used.length===9){done=true;continue;}
  const m=/^add:([0-8])$/.exec(action);if(!m)return null;const i=Number(m[1]);if(used.includes(i))return null;used.push(i);
 }
 return {used,done,sum:used.reduce((n,i)=>n+data.samples[i].value*data.samples[i].weight,0),divisor:kernelFilters[kind].divisor,value:data.value};
}
