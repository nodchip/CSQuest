export const complexityCases={
 linear:[{size:4,target:1,method:'linear'},{size:4,target:4,method:'linear'},{size:8,target:9,method:'linear'}],
 binary:[{size:7,target:8,method:'binary'},{size:15,target:16,method:'binary'}],
 compare:[{size:7,target:1,method:'linear'},{size:7,target:1,method:'binary'},{size:7,target:8,method:'linear'},{size:7,target:8,method:'binary'}]
};
export function replayComplexity(kind,history){
 const cases=complexityCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,low=1,high=cases[0].size,count=0,found=false,finished=false,done=false,results=[],last='';
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='next'){
   if(!finished)return null;const task=cases[scene];results.push({size:task.size,target:task.target,method:task.method,count,found});scene++;done=scene===cases.length;
   if(!done){low=1;high=cases[scene].size;count=0;found=false;finished=false;last='';}continue;
  }
  if(finished)return null;const task=cases[scene],expected=task.method==='linear'?low:Math.floor((low+high)/2);
  if(action!==`probe:${expected}`)return null;
  count++;
  if(expected===task.target){found=true;finished=true;last=`番号${expected}を見つけました。`;}
  else{if(task.method==='linear'||expected<task.target)low=expected+1;else high=expected-1;finished=low>high;last=finished?'調べる本がなくなりました。見つかりません。':`番号${expected}を調べました。`;}
 }
 return {scene,low,high,count,found,finished,done,results,last};
}
