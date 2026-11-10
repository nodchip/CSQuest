const pair=[{id:'near',name:'青の灯り',depth:2,cell:0},{id:'far',name:'赤の灯り',depth:5,cell:0}];
const ties=[{id:'blue',name:'青の灯り',depth:2,cell:0},{id:'red',name:'赤の灯り',depth:2,cell:0}];
export const depthCases={
 painter:[{fragments:pair,order:['near','far']},{fragments:pair,order:['far','near']}],
 buffer:[{fragments:pair,order:['near','far']},{fragments:pair,order:['far','near']}],
 equal:[{fragments:ties,order:['blue','red']},{fragments:ties,order:['red','blue']},{fragments:[{id:'blue',name:'青の灯り',depth:4,cell:0},{id:'red',name:'赤の灯り',depth:3,cell:1},{id:'gold',name:'金の灯り',depth:2,cell:0}],order:['blue','red','gold']}]
};
export function replayDepth(kind,history){
 const cases=depthCases[kind];if(!cases||!Array.isArray(history))return null;let scene=0,drawn=[],pixels=[null,null],results=[];
 for(const action of history){const c=cases[scene];if(!c||typeof action!=='string')return null;
  if(action==='reset'){drawn=[];pixels=[null,null];continue;}
  if(action.startsWith('draw:')){const id=action.slice(5),fragment=c.fragments.find(x=>x.id===id);if(!fragment||drawn.includes(id)||c.order[drawn.length]!==id)return null;drawn.push(id);const old=pixels[fragment.cell];if(kind==='painter'||old===null||fragment.depth<old.depth)pixels[fragment.cell]={id,name:fragment.name,depth:fragment.depth};continue;}
  if(action==='check'&&drawn.length===c.order.length){results.push(pixels.map(x=>x?{...x}:null));scene++;drawn=[];pixels=[null,null];continue;}
  return null;
 }
 return {scene,drawn,pixels,results,done:scene===cases.length};
}
