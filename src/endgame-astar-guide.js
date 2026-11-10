// Directed toy graph: S->A 1, S->B 2, A->G 2, B->G 5.
export const guideEdges={A:2,B:5};
export const guideEstimate={A:2,B:0,G:0};
const fresh=()=>({open:{A:1,B:2},closed:[],parent:{A:'S',B:'S'},found:false,cost:null});
export function replayAstarGuide(kind,history){
 if(!['uniform','astar','compare'].includes(kind)||!Array.isArray(history))return null;
 const modes=kind==='compare'?['greedy','astar']:[kind];let scene=0,state=fresh(),results=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===modes.length){if(action==='answer:astar'){done=true;continue;}return null;}
  if(action==='reset'){state=fresh();continue;}
  if(state.found){if(action!=='check')return null;results.push({mode:modes[scene],cost:state.cost,order:[...state.closed],parent:state.parent.G});scene++;state=fresh();if(scene===modes.length&&kind!=='compare')done=true;continue;}
  const mode=modes[scene],score=(id,g)=>mode==='uniform'?g:mode==='greedy'?guideEstimate[id]:g+guideEstimate[id],entries=Object.entries(state.open),min=Math.min(...entries.map(([id,g])=>score(id,g))),m=/^visit:([ABG])$/.exec(action);
  if(!m||!Object.hasOwn(state.open,m[1])||score(m[1],state.open[m[1]])!==min)return null;
  const id=m[1],g=state.open[id];delete state.open[id];state.closed.push(id);
  if(id==='G'){state.found=true;state.cost=g;continue;}
  const goal=g+guideEdges[id];if(!Object.hasOwn(state.open,'G')||goal<state.open.G){state.open.G=goal;state.parent.G=id;}
 }
 return {scene,mode:modes[scene]??null,state,results,done};
}
