export const lockingLevel={
  id:'counter-lock', number:'16', kind:'locking', name:'記録の鍵', tag:'排他制御',
  title:'宝石の記録を守る',
  story:'二人の精霊が共有の記録を確実に増やせるよう、記録を使う間は鍵を持つ約束にしましょう。',
};

export function createLockedTrial(waited=false) {
  return { value:0, owner:null, workers:{A:{stage:'acquire',local:null},B:{stage:'acquire',local:null}}, log:[], waited, done:false };
}

export function stepLockedWorker(state,id) {
  if(state.done) throw new Error('今回の試行は終了しています。');
  if(id!=='A'&&id!=='B') throw new RangeError('未知の精霊です。');
  const worker=state.workers[id];
  if(worker.stage==='done') throw new RangeError('この精霊の仕事は終わっています。');
  if(worker.stage==='acquire' && state.owner!==null) {
    return {...state,waited:true,log:[...state.log,`${id} は鍵を取れず、${state.owner} が返すまで待ちます。`]};
  }
  const workers={...state.workers};
  let value=state.value, owner=state.owner, message;
  if(worker.stage==='acquire') {owner=id;workers[id]={...worker,stage:'read'};message=`${id} は鍵を取りました。`;}
  else if(worker.stage==='read') {workers[id]={stage:'write',local:value};message=`${id} は記録の ${value} を読みました。`;}
  else if(worker.stage==='write') {value=worker.local+1;workers[id]={...worker,stage:'release'};message=`${id} は ${value} を記録に書きました。`;}
  else {owner=null;workers[id]={...worker,stage:'done'};message=`${id} は鍵を返しました。`;}
  const done=Object.values(workers).every(item=>item.stage==='done');
  return {value,owner,workers,log:[...state.log,message],waited:state.waited,done};
}
