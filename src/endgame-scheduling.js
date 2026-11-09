// One workbench, unit-length ticks, zero switch cost; arrivals are queued
// before a preempted job is requeued at the same tick boundary.
export const schedulingCases=[
 {jobs:[['A',0,3],['B',0,1]],method:'fcfs'}, {jobs:[['A',0,3],['B',0,1]],method:'round'},
 {jobs:[['A',0,1],['B',0,3]],method:'fcfs'}, {jobs:[['A',0,1],['B',0,3]],method:'round'},
 {jobs:[['A',0,2],['B',1,1]],method:'fcfs'}, {jobs:[['A',0,2],['B',1,1]],method:'round'}
];
export function planSchedule(example){
 const left=Object.fromEntries(example.jobs.map(([id,,length])=>[id,length])),ready=[],finished={},steps=[];
 let time=0,carry=null,running=null;
 while(Object.keys(finished).length<example.jobs.length){
  for(const [id,arrival] of example.jobs)if(arrival===time)ready.push(id);
  if(carry){ready.push(carry);carry=null;}
  const current=running??ready.shift();if(!current)throw Error('This model requires a job at each tick.');
  steps.push({time,current,ready:[...ready],remaining:{...left},finished:{...finished}});
  left[current]--;time++;
  if(!left[current]){finished[current]=time;running=null;}
  else if(example.method==='round'){carry=current;running=null;}
  else running=current;
 }
 return {steps,finished};
}
export function replayScheduling(history){
 if(!Array.isArray(history))return null;
 let scene=0,step=0;const results=[];
 for(const action of history){
  const task=schedulingCases[scene];if(!task||typeof action!=='string')return null;
  const plan=planSchedule(task);if(action!==`run:${plan.steps[step].current}`)return null;
  step++;if(step===plan.steps.length){results.push(plan.finished);scene++;step=0;}
 }
 return {scene,step,results,done:scene===schedulingCases.length};
}
