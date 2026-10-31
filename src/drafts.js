import {createSearch,inspectPlace} from './search.js';
import {createRouteSearch,settlePlace} from './routes.js';
import {createSchedule,runJob} from './scheduling.js';
import {createBattle,takeTurn} from './battle.js';
import {createDelivery,transmit} from './delivery.js';
import {createTrial,stepWorker} from './concurrency.js';
import {createLockedTrial,stepLockedWorker} from './locking.js';

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

export function restoreBattle(steps) {
  checkSteps(steps,6);
  let state=createBattle();
  for(const step of steps) state=takeTurn(state,step);
  return state;
}

export function restoreDelivery(steps) {
  checkSteps(steps,5);
  let state=createDelivery();
  for(const step of steps) state=transmit(state,step);
  return state;
}

export function restoreConcurrency(draft) {
  if(!draft||!Array.isArray(draft.past)||draft.past.length>2) throw new RangeError('過去の試行が不正です。');
  let observed=[];
  for(const steps of draft.past) {
    checkSteps(steps,4);
    let previous=createTrial(observed);
    for(const step of steps) previous=stepWorker(previous,step);
    if(!previous.done||observed.includes(previous.value)) throw new RangeError('過去の試行が不正です。');
    observed=previous.observed;
  }
  checkSteps(draft.current,4);
  let state=createTrial(observed);
  for(const step of draft.current) state=stepWorker(state,step);
  return {state,past:draft.past.map(steps=>steps.slice()),current:draft.current.slice()};
}

export function restoreLocking(steps) {
  checkSteps(steps,9);
  let state=createLockedTrial();
  for(const step of steps) {
    const before=state;
    state=stepLockedWorker(state,step);
    if(before.waited && state.workers[step]===before.workers[step]) throw new RangeError('重複した待機記録です。');
  }
  return state;
}
