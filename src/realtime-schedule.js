export const realTimeScheduleLevel={id:'forge-realtime-schedule',number:'757',kind:'realtime-schedule',name:'刻限を守る二つの灯台',tag:'周期仕事と期限順スケジューリング',title:'鐘に合わせて灯りを守る',story:'二つの灯台に定期的な点検が必要です。一人の精霊が二つの決まりで仕事を選び、期限を守れるか比べましょう。'};
export const realTimeModes=['fixed','deadline'];
export function realTimeTrace(mode,history){
 if(!realTimeModes.includes(mode)||!Array.isArray(history)||history.length>12)throw new RangeError('記録が不正です。');
 const jobs=[],misses=[],steps=[];
 for(let time=0;time<=history.length;time++){
  for(const j of jobs)if(j.deadline===time&&j.remaining>0)misses.push({id:j.id,release:j.release,deadline:j.deadline,remaining:j.remaining});
  if(time<12){for(const [id,period,work] of [['a',4,2],['b',6,3]])if(time%period===0)jobs.push({id,release:time,deadline:time+period,remaining:work});}
  if(time===history.length)break;
  const ready=jobs.filter(j=>j.remaining>0).sort((x,y)=>mode==='fixed'?(x.id===y.id?x.deadline-y.deadline:x.id==='a'?-1:1):(x.deadline-y.deadline||x.id.localeCompare(y.id)||x.release-y.release));
  const chosen=ready[0]?.id??'idle';if(history[time]!==chosen)throw new RangeError('決まりに合わない操作です。');if(ready.length)ready[0].remaining--;steps.push(chosen);
 }
 const ready=history.length===12?[]:jobs.filter(j=>j.remaining>0).sort((x,y)=>mode==='fixed'?(x.id===y.id?x.deadline-y.deadline:x.id==='a'?-1:1):(x.deadline-y.deadline||x.id.localeCompare(y.id)||x.release-y.release));
 return {time:history.length,jobs:jobs.map(j=>({...j})),misses,steps,next:ready[0]?.id??(history.length===12?null:'idle')};
}
export function realTimeCreate(){return {mode:'fixed',trials:{fixed:[],deadline:[]},answer:'',checked:false};}
export function realTimeStep(s,choice){if(!['a','b','idle'].includes(choice))throw new RangeError('仕事が不正です。');const history=s.trials[s.mode],trace=realTimeTrace(s.mode,history);if(trace.next===null||trace.next!==choice)return false;history.push(choice);return true;}
export function realTimeComplete(s){return realTimeModes.every(m=>s.trials[m].length===12)&&s.answer==='different'&&s.checked;}
export function realTimeRestore(s){if(!s||!realTimeModes.includes(s.mode)||!s.trials||!['','different','always','same'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const out=realTimeCreate();out.mode=s.mode;out.answer=s.answer;out.checked=s.checked;for(const mode of realTimeModes){realTimeTrace(mode,s.trials[mode]);out.trials[mode]=[...s.trials[mode]];}return out;}
