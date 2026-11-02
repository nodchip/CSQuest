export const queueObservationLevel={id:'forest-queue-observation',number:'994',kind:'queue-observation',name:'伝令所の観測記録',tag:'待ち行列・有限時間の観測',title:'６刻の記録を調べよう',story:'依頼993の伝令所で、記録係が６刻の手紙の出入りを調べています。'};
// Arrivals and service durations are a fixed teaching trace, not samples from M/M/1.
export const queueJobs=[{id:'甲',arrival:0,service:2},{id:'乙',arrival:1,service:1},{id:'丙',arrival:2,service:2},{id:'丁',arrival:4,service:2}];
export function observeQueue(){
 const waiting=[],rows=[],completed=[];let active=null,area=0;
 for(let time=0;time<6;time++){
  const finished=active&&active.finish===time?active:null;if(finished){completed.push({id:finished.id,arrival:finished.arrival,finish:time,sojourn:time-finished.arrival});active=null;}
  const arrivals=queueJobs.filter(job=>job.arrival===time);waiting.push(...arrivals);
  const started=!active&&waiting.length?waiting.shift():null;if(started)active={...started,finish:time+started.service};
  const inSystem=waiting.length+(active?1:0);area+=inSystem;
  rows.push({time,arrivals:arrivals.map(job=>job.id),finished:finished?.id??null,started:started?.id??null,active:active?.id??null,waiting:waiting.map(job=>job.id),inSystem});
 }
 const unfinished=[...(active?[active]:[]),...waiting].map(job=>({id:job.id,arrival:job.arrival,elapsed:6-job.arrival}));
 return {rows,completed,unfinished,area,completedTime:completed.reduce((sum,job)=>sum+job.sojourn,0),unfinishedTime:unfinished.reduce((sum,job)=>sum+job.elapsed,0)};
}
export function queueObservationCreate(){return {step:0,area:null,unfinished:null,checked:false,reflection:null};}
export function queueObservationComplete(s){return s.step===6&&s.checked&&s.area==='nine'&&s.unfinished==='two'&&s.reflection==='boundary';}
export function queueObservationRestore(s){if(!s||!Number.isInteger(s.step)||s.step<0||s.step>6||![null,'seven','nine','eleven'].includes(s.area)||![null,'zero','one','two'].includes(s.unfinished)||typeof s.checked!=='boolean'||(s.checked&&s.step!==6)||![null,'boundary','equal','stationary'].includes(s.reflection))throw new RangeError('途中記録が不正です');return {...queueObservationCreate(),step:s.step,area:s.area,unfinished:s.unfinished,checked:s.checked,reflection:s.reflection};}
