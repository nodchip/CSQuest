import {adjacencyNodes,adjacencyCases,createAdjacencyTrial,toggleAdjacency,adjacencyMatches} from './adjacency.js';
export const routeAdjacencyQueries=[{from:0,to:2,direct:true},{from:0,to:3,direct:false},{from:3,to:0,direct:true}];
export function replayAdjacencyRoute(kind,history){
 if(!['list','matrix','compare'].includes(kind)||!Array.isArray(history))return null;
 let scene=0,state=createAdjacencyTrial('roads'),answers=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){scene=0;state=createAdjacencyTrial('roads');answers=[];continue;}
  if(kind==='compare'){
   const q=routeAdjacencyQueries[scene];if(action!==`answer:${q.direct?'yes':'no'}`)return null;
   answers.push(q.direct);scene++;done=scene===routeAdjacencyQueries.length;continue;
  }
  if(action==='check'){
   if(kind==='matrix'){if(!adjacencyMatches(state,'matrix'))return null;done=true;continue;}
   const expected=adjacencyNodes.map((_,to)=>adjacencyCases.roads.edges.some(([from,target])=>from===scene&&target===to));
   if(!state.list[scene].every((value,i)=>value===expected[i]))return null;
   scene++;done=scene===adjacencyNodes.length;continue;
  }
  const m=/^toggle:([0-3]):([0-3])$/.exec(action);if(!m)return null;
  const from=Number(m[1]),to=Number(m[2]);if(kind==='list'&&from!==scene)return null;
  state=toggleAdjacency(state,kind,from,to);
 }
 return {scene,state,answers,done};
}
export {adjacencyNodes,adjacencyCases};
