import {traversalOrder,traversalTrees} from './tree-traversal.js';
export function replayTreeOrders(kind,history){
 if(!['pre','in','post'].includes(kind)||!Array.isArray(history)||history.length>30)return null;
 const order=traversalOrder(traversalTrees.branch,kind),visited=[];let done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){visited.length=0;continue;}
  const m=/^visit:([A-F])$/.exec(action);if(!m||m[1]!==order[visited.length])return null;
  visited.push(m[1]);if(visited.length===order.length)done=true;
 }
 return {visited,done};
}
