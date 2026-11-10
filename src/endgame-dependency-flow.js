export const dependencyFlowCases={
 line:{tasks:{A:'会場を整える',B:'道具を運ぶ',C:'灯りを取り付ける'},edges:[['A','B'],['B','C']]},
 branch:{tasks:{A:'灯りを用意する',B:'飾り布を用意する',C:'飾りを組み立てる',D:'門に飾る'},edges:[['A','C'],['B','C'],['C','D']]},
 cycle:{tasks:{A:'会場を調べる',B:'灯り札を作る',C:'案内札を作る',D:'門に掲げる'},edges:[['A','B'],['B','C'],['C','B'],['C','D']]},
};
export function replayDependencyFlow(kind,history){
 if(!Object.hasOwn(dependencyFlowCases,kind)||!Array.isArray(history))return null;
 const task=dependencyFlowCases[kind],order=[];let stopped=false,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  const available=Object.keys(task.tasks).filter(id=>!order.includes(id)&&task.edges.every(([before,after])=>after!==id||order.includes(before)));
  if(stopped){if(action!=='cycle:B,C')return null;done=true;continue;}
  if(action==='reset'){order.length=0;continue;}
  if(action==='check'){if(order.length!==Object.keys(task.tasks).length)return null;done=true;continue;}
  if(action==='stop'){if(kind!=='cycle'||available.length||order.length===Object.keys(task.tasks).length)return null;stopped=true;continue;}
  const m=/^task:([ABCD])$/.exec(action);if(!m||!available.includes(m[1]))return null;order.push(m[1]);
 }
 return {order,stopped,done};
}
