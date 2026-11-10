export const cpuCases={
 basic:[{program:[['load',3],['add',2],['out']],data:null},{program:[['load',1],['add',4],['out']],data:null}],
 branch:[{program:[['read',4],['zero',3],['add',2],['out']],data:0},{program:[['read',4],['zero',3],['add',2],['out']],data:3}],
 data:[{program:[['read',4],['add',2],['out']],data:1},{program:[['read',4],['add',2],['out']],data:4}]
};
export function replayCpu(kind,history){
 const cases=cpuCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,pc=0,acc=0,phase='fetch',ir=null,irAddress=null,output=null,halted=false,done=false,results=[],last='';
 for(const action of history){
  if(typeof action!=='string'||done)return null;const task=cases[scene];
  if(action==='next'&&halted){results.push({data:task.data,output,acc});scene++;done=scene===cases.length;if(!done){pc=0;acc=0;phase='fetch';ir=null;irAddress=null;output=null;halted=false;last='';}continue;}
  if(halted||action!==phase)return null;
  if(phase==='fetch'){if(pc<0||pc>=task.program.length)return null;irAddress=pc;ir=task.program[pc];pc++;phase='decode';last=`番地${irAddress}の命令を取得し、次の位置を${pc}にしました。`;continue;}
  if(phase==='decode'){phase='execute';last=`番地${irAddress}の命令を解読しました。`;continue;}
  const [op,n]=ir;
  if(op==='load')acc=n;else if(op==='read')acc=task.data;else if(op==='add')acc+=n;else if(op==='zero'&&acc===0)pc=n;else if(op==='out'){output=acc;halted=true;}
  last=op==='out'?`結果${output}を表示して終了しました。`:op==='zero'?`値が${acc===0?'０なので分岐':'０ではないので次へ進み'}、次の位置は${pc}です。`:`実行後の値は${acc}です。`;
  phase='fetch';
 }
 return {scene,pc,acc,phase,ir,irAddress,output,halted,done,results,last};
}
