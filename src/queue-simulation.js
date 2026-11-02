export const queueSimulationLevel={id:'forest-queue-simulation',number:'995',kind:'queue-simulation',name:'伝令所の乱数実験',tag:'待ち行列・シミュレーション',title:'観測を変えて伝令所を調べよう',story:'伝令所の記録係が、依頼993の理論値と、異なる観測履歴を比べています。'};
export const queueSeeds=[11,37],queueHorizons=[10,1000];
function randomStream(seed){let state=seed>>>0;return ()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return ((state>>>0)+0.5)/4294967296;};}
export function generateQueueJobs(seed,horizon){
 if(!queueSeeds.includes(seed)||!queueHorizons.includes(horizon))throw new RangeError('不正な観測条件');
 const arrivalRandom=randomStream(seed^0x9e3779b9),serviceRandom=randomStream(seed^0x243f6a88),jobs=[];let time=0;
 while(true){time+=-Math.log(arrivalRandom())/3;if(time>=horizon)break;jobs.push({arrival:time,service:-Math.log(serviceRandom())/4});}
 return jobs;
}
export function simulateQueue(jobs,horizon){
 if(!Number.isFinite(horizon)||horizon<=0||!Array.isArray(jobs)||jobs.some((job,i)=>!Number.isFinite(job.arrival)||job.arrival<0||job.arrival>=horizon||!Number.isFinite(job.service)||job.service<=0||(i>0&&jobs[i-1].arrival>job.arrival)))throw new RangeError('不正な履歴');
 let index=0,active=null,last=0,area=0,completedTime=0,completed=0;const waiting=[];
 while(true){const arrival=index<jobs.length?jobs[index].arrival:Infinity,finish=active?active.finish:Infinity,time=Math.min(arrival,finish);if(time>horizon)break;
  area+=(time-last)*(waiting.length+(active?1:0));last=time;
  if(finish<=arrival){completed++;completedTime+=time-active.arrival;active=null;if(waiting.length){const job=waiting.shift();active={...job,finish:time+job.service};}}
  else{const job=jobs[index++];if(active)waiting.push(job);else active={...job,finish:time+job.service};}
 }
 area+=(horizon-last)*(waiting.length+(active?1:0));const unfinished=[...(active?[active]:[]),...waiting];
 const unfinishedTime=unfinished.reduce((sum,job)=>sum+horizon-job.arrival,0);
 return {arrivals:jobs.length,completed,unfinished:unfinished.length,area,completedTime,unfinishedTime,meanCount:area/horizon,meanCompletedTime:completed?completedTime/completed:null};
}
export function queueSimulationCreate(){return {seed:11,horizon:10,observed:{'11:10':false,'11:1000':false,'37:10':false,'37:1000':false},answer:null,checked:false,reflection:null};}
export function queueSimulationComplete(s){return Object.values(s.observed).every(Boolean)&&s.checked&&s.answer==='sample'&&s.reflection==='limits';}
export function queueSimulationRestore(saved){if(!saved||!queueSeeds.includes(saved.seed)||!queueHorizons.includes(saved.horizon)||![null,'sample','exact','monotone'].includes(saved.answer)||typeof saved.checked!=='boolean'||![null,'limits','none','guarantee'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const s=queueSimulationCreate();s.seed=saved.seed;s.horizon=saved.horizon;s.answer=saved.answer;s.checked=saved.checked;s.reflection=saved.reflection;for(const key of Object.keys(s.observed)){if(typeof saved.observed?.[key]!=='boolean')throw new RangeError('途中記録が不正です');s.observed[key]=saved.observed[key];}return s;}
