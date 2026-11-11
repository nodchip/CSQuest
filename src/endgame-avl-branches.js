import {avlCases,avlBalanced,avlStep,newAvlTrial} from './avl-rotations.js';
export function replayAvlBranches(kind,history){
 if(!['ll','rr','lr'].includes(kind)||!Object.hasOwn(avlCases,kind)||!Array.isArray(history)||history.length>80)return null;
 let trial=newAvlTrial(),done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){trial=newAvlTrial();continue;}
  if(action==='check'){if(trial.index!==3||!avlBalanced(trial.tree))return null;done=true;continue;}
  let next;
  try {if(action==='insert')next=avlStep(kind,trial,'insert',null,null);else {const m=/^rotate:(10|20|30):(left|right)$/.exec(action);if(!m)return null;next=avlStep(kind,trial,'rotate',Number(m[1]),m[2]);}}catch{return null;}
  if(next.history.length!==trial.history.length+1)return null;
  trial=next;
 }
 return {trial,done};
}
