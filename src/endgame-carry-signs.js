import {addFour} from './adder.js';
const parts={p:'XOR',sum:'XOR',ab:'AND',pc:'AND',carry:'OR'};
const cases={signed:[[0,1,1,1],[0,0,0,1]],unsigned:[[1,1,1,1],[0,0,0,1]]};
export function fourBitExample(kind){if(!Object.hasOwn(cases,kind))return null;return addFour(parts,...cases[kind]);}
export function replayCarrySigns(kind,history){
 if(!['signed','unsigned','compare'].includes(kind)||!Array.isArray(history)||history.length>8)return null;
 const result=fourBitExample(kind);let bits=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  const m=/^bit:([01])$/.exec(action);
  if(result&&m&&bits.length<4&&Number(m[1])===result.steps[bits.length].sum){bits.push(Number(m[1]));continue;}
  if(result&&bits.length===4&&action===`answer:${kind}`||kind==='compare'&&action==='answer:different'){done=true;continue;}
  return null;
 }
 return {bits,done,result};
}
export function advanceCarrySigns(kind,history,action){const p=replayCarrySigns(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayCarrySigns(kind,next)?next:null;}
