export const estimateScheduleLevel={id:'guild-estimate-schedule',number:'1072',kind:'estimate-schedule',name:'工房の見積りと届け日',tag:'見積り・依存関係・実績',title:'薬草台帳の仕事を割り当てる',story:'薬師の台帳を届けるため、ギルドの仲間に４つの仕事を依頼します。見積りと実績を比べ、待ち合わせのある仕事を進めましょう。'};
export const estimateTasks=[
 {id:'A',name:'要件を確かめる',range:[1,2,3],actual:3,needs:[]},
 {id:'B',name:'画面を作る',range:[1,2,3],actual:2,needs:['A']},
 {id:'C',name:'台帳を作る',range:[1,3,5],actual:4,needs:['A']},
 {id:'D',name:'組み合わせて試す',range:[1,2,3],actual:3,needs:['B','C']}
];
export const estimateRuns=[{id:'parallel',name:'見積り・２人',workers:2,actual:false,target:7},{id:'actual',name:'実績・２人',workers:2,actual:true,target:10},{id:'single',name:'見積り・１人',workers:1,actual:false,target:9}];
export function estimateDuration(task,actual){return actual?task.actual:task.range.reduce((a,b)=>a+b,0)/3;}
export function estimateReplay(index,history){
 const run=estimateRuns[index];if(!run||!Array.isArray(history)||history.length>8)throw new RangeError('作業記録が不正です。');
 let time=0,finished=[],active=[],started=[];
 for(const event of history){
  if(event==='tick'){if(!active.length)throw new RangeError('進行中の仕事がありません。');time=Math.min(...active.map(x=>x.end));finished.push(...active.filter(x=>x.end===time).map(x=>x.id));active=active.filter(x=>x.end!==time);continue;}
  const task=estimateTasks.find(x=>x.id===event);if(!task||started.includes(event)||active.length>=run.workers||!task.needs.every(x=>finished.includes(x)))throw new RangeError('担当か前の仕事を確認しましょう。');
  started.push(event);active.push({id:event,end:time+estimateDuration(task,run.actual)});
 }
 return {time,finished,active,started,done:finished.length===estimateTasks.length,work:estimateTasks.reduce((sum,t)=>sum+estimateDuration(t,run.actual),0)};
}
export function estimateCreate(){return {current:0,histories:[[],[],[]],seen:[],reflection:null,risk:null};}
export function estimateDone(q){return estimateRuns.every(x=>q.seen.includes(x.id))&&q.reflection==='different'&&q.risk==='range';}
export function estimateRestore(q){
 if(!q||!Number.isInteger(q.current)||q.current<0||q.current>=estimateRuns.length||!Array.isArray(q.histories)||q.histories.length!==estimateRuns.length||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(id=>!estimateRuns.some(x=>x.id===id))||![null,'different','same'].includes(q.reflection)||![null,'range','promise'].includes(q.risk))throw new RangeError('途中記録が不正です。');
 const histories=q.histories.map((h,i)=>{const state=estimateReplay(i,h),recorded=q.seen.includes(estimateRuns[i].id);if(recorded&&(!state.done||state.time!==estimateRuns[i].target))throw new RangeError('見積りの達成記録が不正です。');return [...h];});
 return {...q,histories,seen:[...q.seen]};
}
