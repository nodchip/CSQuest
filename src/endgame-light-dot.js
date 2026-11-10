import {anchor,rays,dot} from './vectors.js';
export function replayLightDot(kind,history){
 if(!['positive','zero','negative'].includes(kind)||!Array.isArray(history)||history.length>20)return null;
 const desired={positive:'positive',zero:'zero',negative:'negative'}[kind];let phase=0,ray=null,value=null,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){phase=0;ray=null;value=null;continue;}
  if(phase===0){const m=/^ray:(sun|moon|shadow)$/.exec(action);if(!m)return null;const v=dot(anchor,rays[m[1]].vector),sign=v>0?'positive':v<0?'negative':'zero';if(sign!==desired)return null;ray=m[1];phase=1;}
  else if(phase===1){const expected=dot(anchor,rays[ray].vector);if(action!==`dot:${expected}`)return null;value=expected;phase=2;if(kind!=='negative')done=true;}
  else if(action==='angle:greater')done=true;
  else return null;
 }
 return {phase,ray,value,done};
}
