const balanced=[4,2,6,1,3,5,7],chain=[1,2,3,4,5,6,7];
export const treeCases={
 search:[{tree:'balanced',target:3},{tree:'balanced',target:8}],
 insert:[{target:4},{target:2},{target:6},{target:3}],
 compare:[{tree:'balanced',target:7},{tree:'chain',target:7},{tree:'balanced',target:8},{tree:'chain',target:8}]
};
function add(nodes,value){
 if(!nodes.root){nodes.root=value;nodes.items[value]={left:null,right:null};return;}
 let n=nodes.root;for(;;){const side=value<n?'left':'right',next=nodes.items[n][side];if(next===null){nodes.items[n][side]=value;nodes.items[value]={left:null,right:null};return;}n=next;}
}
function make(values){const nodes={root:null,items:{}};for(const value of values)add(nodes,value);return nodes;}
export function replayTree(kind,history){
 const cases=treeCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,nodes=make(kind==='insert'?[]:balanced),current=nodes.root,path=[],finished=false,found=false,done=false,results=[];
 for(const action of history){
  if(typeof action!=='string'||done)return null;const task=cases[scene];
  if(action==='next'&&finished){results.push({target:task.target,tree:task.tree??'built',path:[...path],found});scene++;done=scene===cases.length;if(!done){if(kind!=='insert')nodes=make(cases[scene].tree==='chain'?chain:balanced);current=nodes.root;path=[];finished=false;found=false;}continue;}
  if(finished)return null;
  if(action==='empty'&&current===null&&kind!=='insert'){finished=true;found=false;continue;}
  if(action==='insert'&&current===null&&kind==='insert'){add(nodes,task.target);finished=true;found=true;continue;}
  if(current===null||action!==`visit:${current}`)return null;
  const value=current;path.push(value);
  if(value===task.target){if(kind==='insert')return null;finished=true;found=true;}
  else current=nodes.items[value][task.target<value?'left':'right'];
 }
 return {scene,nodes,current,path,finished,found,done,results};
}
