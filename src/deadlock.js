export const deadlockLevel={id:'two-locks',number:'30',kind:'deadlock',name:'ふたつの鍵の行き詰まり',tag:'デッドロックと順序',title:'工房の二つの鍵',story:'二人の精霊が宝石と台帳を使います。両方の鍵が必要な仕事で、鍵を取る順番を比べましょう。'};
export const lockModes={opposing:{name:'逆の順番',orders:{A:['sun','moon'],B:['moon','sun']}},ordered:{name:'同じ順番',orders:{A:['sun','moon'],B:['sun','moon']}}};
export const lockNames={sun:'太陽',moon:'月'};
export function createLockTrial(mode){
  if(!Object.hasOwn(lockModes,mode))throw new RangeError('未知の順番です。');
  return {mode,owners:{sun:null,moon:null},workers:{A:{stage:0,waiting:false},B:{stage:0,waiting:false}},waited:false,status:'playing',log:[],message:'精霊を選んで仕事を進めましょう。'};
}
export function stepTwoLocks(state,id){
  if(!['A','B'].includes(id)||state.status!=='playing'||state.workers[id].stage===5)throw new RangeError('この精霊は進めません。');
  const worker=state.workers[id],order=lockModes[state.mode].orders[id],owners={...state.owners};
  const workers={...state.workers,A:{...state.workers.A},B:{...state.workers.B}};
  let waited=state.waited,message;
  if(worker.stage<2){
    const key=order[worker.stage],owner=owners[key];
    if(owner!==null){
      if(worker.waiting)return {...state,message:`${id} は ${lockNames[key]}の鍵を待っています。`};
      workers[id].waiting=true;waited=true;message=`${id} は ${owner} が持つ${lockNames[key]}の鍵を待ちます。`;
    }else {owners[key]=id;workers[id].stage++;workers[id].waiting=false;message=`${id} は${lockNames[key]}の鍵を取りました。`;}
  }else if(worker.stage===2){workers[id].stage++;message=`${id} は二つの鍵を使って仕事をしました。`;}
  else {const key=order[worker.stage===3?1:0];owners[key]=null;workers[id].stage++;message=`${id} は${lockNames[key]}の鍵を返しました。`;}
  let status='playing';
  if(workers.A.waiting&&workers.B.waiting){status='deadlocked';message+=' 二人が互いの鍵を待ち、進めません。';}
  else if(workers.A.stage===5&&workers.B.stage===5){status='done';message+=' 二人の仕事が終わりました。';}
  return {mode:state.mode,owners,workers,waited,status,log:[...state.log,message],message};
}
export function restoreTwoLocks(saved){
  if(!saved||!Object.hasOwn(lockModes,saved.selected)||!saved.steps)throw new RangeError('途中記録が不正です。');
  const states={},steps={};
  for(const id of Object.keys(lockModes)){
    const list=saved.steps[id];if(!Array.isArray(list)||list.length>14||list.some(x=>!['A','B'].includes(x)))throw new RangeError('途中記録が不正です。');
    let state=createLockTrial(id);for(const worker of list){const next=stepTwoLocks(state,worker);if(next.log.length!==state.log.length+1)throw new RangeError('途中記録が不正です。');state=next;}states[id]=state;steps[id]=list.slice();
  }
  return {selected:saved.selected,steps,states};
}
export function locksComplete(states){return states.opposing.status==='deadlocked'&&states.ordered.status==='done'&&states.ordered.waited;}
