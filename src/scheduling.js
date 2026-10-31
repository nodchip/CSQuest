export const schedulingLevel={
  id:'workshop-scheduling', number:'14', kind:'scheduling', name:'魔法炉の順番', tag:'資源のスケジューリング',
  title:'ひとつの炉を分け合う',
  story:'３人の職人が一つの魔法炉を使いたがっています。順番の決め方を変え、仕事がいつ終わるか比べましょう。',
};

export const jobs={ A:{name:'ランプ',duration:3}, B:{name:'鍵',duration:2}, C:{name:'鈴',duration:1} };
export const policies={fcfs:'先着順',rr:'ラウンドロビン'};

// All jobs arrive at time zero; one unit of work takes one unit of time.
export function createSchedule(policy) {
  if (!Object.hasOwn(policies,policy)) throw new RangeError('未知の方式です。');
  return {policy,time:0,queue:Object.keys(jobs),remaining:{A:3,B:2,C:1},completion:{},firstRun:{},history:[],message:'待ち行列の先頭を選びましょう。',done:false};
}

export function runJob(state,id) {
  if (state.done) throw new Error('すべての仕事が終わっています。');
  if (!state.queue.includes(id)) throw new RangeError('待ち行列にない仕事です。');
  if (id!==state.queue[0]) return {...state,message:`${id} より先に ${state.queue[0]} が待っています。`};
  const queue=state.queue.slice();
  const remaining={...state.remaining,[id]:state.remaining[id]-1};
  const completion={...state.completion}, firstRun={...state.firstRun};
  if (!Object.hasOwn(firstRun,id)) firstRun[id]=state.time;
  const time=state.time+1;
  if (remaining[id]===0) {queue.shift();completion[id]=time;}
  else if(state.policy==='rr') {queue.shift();queue.push(id);}
  const done=queue.length===0;
  return {policy:state.policy,time,queue,remaining,completion,firstRun,history:[...state.history,id],message:remaining[id]===0?`${id} の仕事が終わりました。`:`${id} を１時間進めました。`,done};
}
