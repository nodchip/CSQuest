import {derivativeSteps,derivativeMeasure} from './derivative-limit.js';
export const derivativePulseCases={after:['after1','afterHalf','afterSmall'],before:['beforeHalf','beforeSmall'],compare:['after1','afterHalf','afterSmall','beforeHalf','beforeSmall']};
export function replayDerivativePulse(kind,history){
 if(!Object.hasOwn(derivativePulseCases,kind)||!Array.isArray(history))return null;
 const cases=derivativePulseCases[kind];let selected=null,visited=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){selected=null;visited=[];continue;}
  if(action==='check'){if(kind==='compare'||visited.length!==cases.length)return null;done=true;continue;}
  if(action==='limit:4'){if(kind!=='compare'||visited.length!==cases.length)return null;done=true;continue;}
  const sel=/^select:(after1|afterHalf|afterSmall|beforeHalf|beforeSmall)$/.exec(action);
  if(sel){if(!cases.includes(sel[1])||visited.includes(sel[1]))return null;selected=sel[1];continue;}
  if(!selected||action!==`answer:${derivativeMeasure(selected).slope}`)return null;
  visited.push(selected);selected=null;
 }
 return {selected,visited,done};
}
export {derivativeSteps,derivativeMeasure};
