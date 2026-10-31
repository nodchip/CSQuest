export const concurrencyLevel={
  id:'shared-counter', number:'15', kind:'concurrency', name:'二人の精霊と宝石', tag:'並行処理',
  title:'増えない宝石の謎',
  story:'二人の精霊がそれぞれ宝石を一つ届けました。共有の記録を一つずつ増やすとき、作業の順番で何が起こるか調べましょう。',
};

export function createTrial(observed=[]) {
  return { value:0, workers:{A:{stage:'read',local:null},B:{stage:'read',local:null}}, log:[], observed:[...observed], done:false };
}

export function stepWorker(state,id) {
  if (state.done) throw new Error('今回の試行は終了しています。');
  if (id!=='A' && id!=='B') throw new RangeError('未知の精霊です。');
  const worker=state.workers[id];
  if(worker.stage==='done') throw new RangeError('この精霊の仕事は終わっています。');
  const workers={...state.workers};
  let value=state.value, message;
  if(worker.stage==='read') {
    workers[id]={stage:'write',local:value};
    message=`${id} は記録の ${value} を読み、手元に覚えました。`;
  } else {
    value=worker.local+1;
    workers[id]={...worker,stage:'done'};
    message=`${id} は手元の ${worker.local} に１を足し、${value} を記録に書きました。`;
  }
  const done=Object.values(workers).every(item=>item.stage==='done');
  const observed=done && !state.observed.includes(value) ? [...state.observed,value] : [...state.observed];
  return {value,workers,log:[...state.log,message],observed,done};
}
