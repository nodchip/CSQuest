import {createSearch,inspectPlace} from './search.js';
import {createRouteSearch,settlePlace} from './routes.js';
import {createSchedule,runJob} from './scheduling.js';

function checkSteps(steps,limit) {
  if(!Array.isArray(steps)||steps.length>limit||steps.some(step=>typeof step!=='string')) throw new RangeError('保存された操作が不正です。');
}

export function restoreForest(steps) {
  checkSteps(steps,8);
  let state=createSearch();
  for(const step of steps) {
    const next=inspectPlace(state,step);
    if(next.explored.length!==state.explored.length+1) throw new RangeError('探索の順番が不正です。');
    state=next;
  }
  return state;
}

export function restoreRoads(steps) {
  checkSteps(steps,4);
  let state=createRouteSearch();
  for(const step of steps) {
    const next=settlePlace(state,step);
    if(next.settled.length!==state.settled.length+1) throw new RangeError('確定の順番が不正です。');
    state=next;
  }
  return state;
}

export function restoreSchedules(draft) {
  if(!draft||typeof draft!=='object'||!['fcfs','rr'].includes(draft.selected)) throw new RangeError('方式が不正です。');
  const states={};
  for(const policy of ['fcfs','rr']) {
    checkSteps(draft[policy],6);
    let state=createSchedule(policy);
    for(const step of draft[policy]) {
      const next=runJob(state,step);
      if(next.time!==state.time+1) throw new RangeError('仕事の順番が不正です。');
      state=next;
    }
    states[policy]=state;
  }
  return {states,selected:draft.selected};
}
