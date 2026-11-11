import {createInstructionTrial,tickInstruction} from './instruction-pipeline.js';
export function replayInstructionHazard(kind,history){
 if(!['unsafe','stall','forward'].includes(kind)||!Array.isArray(history)||history.length>30)return null;
 let state=createInstructionTrial(kind),done=false,trace=[];
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){state=createInstructionTrial(kind);trace=[];continue;}
  if(action==='tick'&&!state.done){state=tickInstruction(state);trace.push({cycle:state.cycle,message:state.message,fetch:state.fetch,decode:state.decode,execute:state.execute?.id??null,operand:state.execute?.id===1?state.execute.operand:null});continue;}
  if(state.done&&action===`answer:${state.blue}`){done=true;continue;}
  return null;
 }
 return {state,trace,done};
}
