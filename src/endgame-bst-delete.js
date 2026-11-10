// Current-adventure adapter for the older fixed deletion exercise.
import {bstDeleteInitial,bstDeleteExecute,bstDeleteCases} from './bst-delete.js';
const cases={leaf:'leaf',single:'single',two:'two'};
export function replayBstDelete(kind,history){
 if(!Object.hasOwn(cases,kind)||!Array.isArray(history))return null;
 const state=bstDeleteInitial(cases[kind]);let done=false;
 try{for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(state.stage==='detach'){
   const node=state.nodes[state.chosen],child=node.left??node.right;
   if(action!==`retain:${child===null?'none':child}`)return null;
   bstDeleteExecute(state,'detach');done=true;
  }else bstDeleteExecute(state,action);
 }}catch{return null;}
 return {state,done,target:bstDeleteCases[cases[kind]].target};
}
