import {roundSmall} from './rounding.js';
export const roundingStoneCases={even:{a:1,b:0.0625},odd:{a:1.125,b:0.0625}};
export function roundingStoneComparison(){const leftFirst=roundSmall(1+0.0625).value,left=roundSmall(leftFirst+0.0625).value,rightFirst=roundSmall(0.0625+0.0625).value,right=roundSmall(1+rightFirst).value;return {leftFirst,left,rightFirst,right};}
export function replayRoundingStones(kind,history){
 if(!['even','odd','compare'].includes(kind)||!Array.isArray(history))return null;
 let tried=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){tried=[];continue;}
  if(kind==='compare'){
   if(action==='try:left'||action==='try:right'){const method=action.slice(4);if(!tried.includes(method))tried.push(method);continue;}
   if(action==='answer:different'&&tried.includes('left')&&tried.includes('right')){done=true;continue;}
   return null;
  }
  const c=roundingStoneCases[kind],rounded=roundSmall(c.a+c.b);
  if(action===`answer:${rounded.value}`){done=true;continue;}
  return null;
 }
 return {tried,done};
}
