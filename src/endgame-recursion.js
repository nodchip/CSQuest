export const sumCases=[[],[2,3],[4,1,2]];
export const treeCases=[[['leaf',[]],'leaf'],['leaf',[],['leaf','leaf']]];
export const repairInputs=[[],[2,3],[4]];
export const treeDescription=node=>node==='leaf'?'札':`箱[${node.map(treeDescription).join('、')}]`;
function frame(node){return {node,next:0,total:0};}
function sumFrame(items){return {items,phase:'enter',child:null};}
export function repairResult(items,base,progress){
 if(items.length&&progress==='same')return {status:'repeat',at:[...items]};
 if(base==='repeat')return {status:'repeat',at:[]};
 return {status:'done',value:items.reduce((a,b)=>a+b,0)};
}
export function replayRecursion(kind,history){
 if(!['sum','tree','repair'].includes(kind)||!Array.isArray(history))return null;
 let scene=0,stack=kind==='sum'?[sumFrame(sumCases[0])]:kind==='tree'?[frame(treeCases[0])]:[],result=null,base='repeat',progress='rest',tests={},done=false;
 const reset=()=>{result=null;tests={};base=scene===0?'repeat':'stop';progress=scene===0?'rest':'same';stack=kind==='sum'?[sumFrame(sumCases[scene])]:kind==='tree'?[frame(treeCases[scene])]:[];};
 const ret=value=>{stack.pop();if(!stack.length){result=value;return;}const parent=stack.at(-1);if(kind==='sum'){parent.child=value;parent.phase='combine';}else{parent.total+=value;parent.next++;}};
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){reset();continue;}
  if(kind==='repair'){
   const m=/^(base|progress):(stop|repeat|rest|same)$/.exec(action);
   if(m&&m[1]==='base'&&['stop','repeat'].includes(m[2])){base=m[2];tests={};continue;}
   if(m&&m[1]==='progress'&&['rest','same'].includes(m[2])){progress=m[2];tests={};continue;}
   const t=/^test:([012])$/.exec(action);
   if(t){const n=Number(t[1]);tests[n]=repairResult(repairInputs[n],base,progress);continue;}
   if(action==='check'&&base==='stop'&&progress==='rest'&&repairInputs.every((_,i)=>Object.hasOwn(tests,i))){scene++;done=scene===2;if(!done)reset();continue;}
   return null;
  }
  const top=stack.at(-1);
  if(kind==='sum'&&top){
   if(action==='call'&&top.phase==='enter'&&top.items.length){top.phase='waiting';stack.push(sumFrame(top.items.slice(1)));continue;}
   if(action==='base'&&top.phase==='enter'&&!top.items.length){ret(0);continue;}
   if(action==='add'&&top.phase==='combine'){ret(top.items[0]+top.child);continue;}
  }
  if(kind==='tree'&&top){
   if(action==='descend'&&Array.isArray(top.node)&&top.next<top.node.length){stack.push(frame(top.node[top.next]));continue;}
   if(action==='leaf'&&top.node==='leaf'){ret(1);continue;}
   if(action==='empty'&&Array.isArray(top.node)&&top.node.length===0){ret(0);continue;}
   if(action==='combine'&&Array.isArray(top.node)&&top.node.length>0&&top.next===top.node.length){ret(top.total);continue;}
  }
  const total=kind==='sum'?sumCases.length:treeCases.length;
  if(action==='next'&&result!==null){scene++;done=scene===total;if(!done)reset();continue;}
  return null;
 }
 return {scene,stack,result,base,progress,tests,done};
}
