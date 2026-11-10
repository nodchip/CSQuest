const trap={values:{S:5,A:3,B:4,G:0},edges:{S:['A','B'],A:['S'],B:['S','G'],G:['B']}};
const path={values:{S:5,A:3,G:0},edges:{S:['A'],A:['S','G'],G:['A']}};
const plateau={values:{S:3,A:3,G:0},edges:{S:['A'],A:['S','G'],G:['A']}};
export const localSearchCases={
 climb:[{map:trap,start:'S',equal:false},{map:path,start:'S',equal:false}],
 restart:[{map:trap,start:'S',equal:false},{map:trap,start:'B',equal:false}],
 plateau:[{map:plateau,start:'S',equal:false},{map:plateau,start:'S',equal:true}],
};
export function replayLocalSearch(kind,history){
 const cases=localSearchCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,place=null,visited=[],inspected=[],ended=false,done=false;
 const reset=()=>{place=cases[scene].start;visited=[place];inspected=[];ended=false;};reset();
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(action==='reset'){reset();continue;}
  const c=cases[scene],neighbors=c.map.edges[place];
  if(ended){if(action!=='next')return null;scene++;done=scene===cases.length;if(!done)reset();continue;}
  const m=/^inspect:([SABG])$/.exec(action);
  if(m&&neighbors.includes(m[1])){if(!inspected.includes(m[1]))inspected.push(m[1]);continue;}
  const eligible=neighbors.filter(x=>!visited.includes(x)&&(c.equal?c.map.values[x]<=c.map.values[place]:c.map.values[x]<c.map.values[place]));
  const allInspected=neighbors.every(x=>inspected.includes(x));
  const move=/^move:([SABG])$/.exec(action);
  if(move&&place!=='G'&&allInspected&&eligible.includes(move[1])&&c.map.values[move[1]]===Math.min(...eligible.map(x=>c.map.values[x]))){place=move[1];visited.push(place);inspected=[];continue;}
  if(action==='check'&&(place==='G'||allInspected&&eligible.length===0)){ended=true;continue;}
  return null;
 }
 return {scene,place,visited,inspected,ended,done};
}
