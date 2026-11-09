export const vectorCases={
 add:[
  {vectors:[[2,1],[-1,2]],target:[1,3]},
  {vectors:[[-1,2],[2,1]],target:[1,3]},
  {vectors:[[-2,-1],[1,2]],target:[-1,1]}
 ],
 scale:[
  {vector:[1,2],factor:2,target:[2,4]},
  {vector:[1,2],factor:-1,target:[-1,-2]},
  {vector:[1,2],factor:0,target:[0,0]}
 ],
 basis:[
  {u:[1,0],v:[1,1],target:[3,2]},
  {u:[1,0],v:[0,1],target:[3,2]}
 ]
};
export function replayVectors(kind,history){
 const tasks=vectorCases[kind];if(!tasks||!Array.isArray(history))return null;
 let scene=0,x=0,y=0,a=0,b=0;const results=[];
 for(const action of history){
  const task=tasks[scene];if(!task||typeof action!=='string')return null;
  if(action==='check'){
   const point=kind==='basis'?[a*task.u[0]+b*task.v[0],a*task.u[1]+b*task.v[1]]:[x,y];
   if(point[0]!==task.target[0]||point[1]!==task.target[1])return null;
   results.push({point,...kind==='basis'?{a,b}:{}});scene++;x=0;y=0;a=0;b=0;
  }else if(kind!=='basis'&&['right','left','up','down'].includes(action)){
   const nx=x+(action==='right'?1:action==='left'?-1:0),ny=y+(action==='up'?1:action==='down'?-1:0);
   if(Math.abs(nx)>4||Math.abs(ny)>4)return null;x=nx;y=ny;
  }else if(kind==='basis'&&/^[ab]:[+-]$/.test(action)){
   const next=(action[0]==='a'?a:b)+(action[2]==='+'?1:-1);if(next< -3||next>3)return null;
   if(action[0]==='a')a=next;else b=next;
  }else return null;
 }
 const task=tasks[scene];const point=kind==='basis'&&task?[a*task.u[0]+b*task.v[0],a*task.u[1]+b*task.v[1]]:[x,y];
 return {scene,point,a,b,results,done:scene===tasks.length};
}
