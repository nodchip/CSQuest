export const transactionLevel={id:'transfer-ledger',number:'35',kind:'transaction',name:'中断に備える台帳',tag:'トランザクション',title:'途切れた送金を確かめる',story:'薬師の工房は口座 A から B へ３枚の硬貨を移します。途中で魔法が途切れたとき、台帳がどうなるか比べましょう。'};
export const transactionModes={separate:{name:'更新を別々に保存',steps:['debit','crash']},atomic:{name:'まとめて確定',steps:['begin','debit','crash','recover','begin','debit','credit','commit','crash']}};
export const actionLabels={begin:'処理を始める',debit:'A から３枚引く',credit:'B に３枚足す',commit:'まとめて確定する',crash:'魔法が途切れる',recover:'装置を立て直す'};
export function createTransaction(mode){if(!Object.hasOwn(transactionModes,mode))throw new RangeError('未知の方式です。');return {mode,index:0,committed:{A:10,B:2},working:null,status:'playing',log:[],message:'指示に従って操作を選びましょう。'};}
export function stepTransaction(state,action){
  if(state.status!=='playing'||!Object.hasOwn(actionLabels,action))throw new RangeError('操作できません。');
  const expected=transactionModes[state.mode].steps[state.index];
  if(action!==expected)return {...state,message:`今は「${actionLabels[expected]}」を選びましょう。`};
  let committed={...state.committed},working=state.working?{...state.working}:null,message;
  if(action==='begin'){working={...committed};message='確定前の作業を始めました。';}
  if(action==='debit'){
    if(state.mode==='separate'){committed.A-=3;message='A から３枚引いた結果を単独で保存しました。';}
    else {working.A-=3;message='作業中の A から３枚引きました。まだ確定前です。';}
  }
  if(action==='credit'){working.B+=3;message='作業中の B に３枚足しました。まだ確定前です。';}
  if(action==='commit'){committed={...working};working=null;message='二つの更新をまとめて確定しました。';}
  if(action==='crash'){
    if(state.mode==='separate')message='途中で途切れました。保存された A の更新だけが残っています。';
    else if(working){working=null;message='途切れたため、確定前の作業を取り消しました。';}
    else message='確定後に途切れました。確定済みの結果が残っています。';
  }
  if(action==='recover')message='装置を立て直しました。もう一度送金を始めます。';
  const index=state.index+1,status=index===transactionModes[state.mode].steps.length?'done':'playing';
  return {mode:state.mode,index,committed,working,status,log:[...state.log,message],message};
}
export function predictTransactionCrash(state,guess){
  if(state.status!=='playing'||transactionModes[state.mode].steps[state.index]!=='crash')throw new RangeError('今は中断後の予測を選べません。');
  if(!['original','partial','transferred'].includes(guess))throw new RangeError('未知の予測です。');
  const expected=state.mode==='separate'?'partial':state.working?'original':'transferred';
  if(guess!==expected){
    const hint=state.mode==='separate'?'単独で保存した更新と、まだ実行していない更新を確認しましょう。':state.working?'まだ確定していない作業は、途切れた後には取り消されます。':'まとめて確定した結果が途切れた後も残ると考えましょう。';
    return {...state,message:`その台帳にはなりません。${hint}`};
  }
  return stepTransaction(state,'crash');
}
export function restoreTransaction(saved){
  if(!saved||!Object.hasOwn(transactionModes,saved.selected)||!saved.actions)throw new RangeError('途中記録が不正です。');
  const states={},actions={};
  for(const [id,mode] of Object.entries(transactionModes)){
    const list=saved.actions[id];if(!Array.isArray(list)||list.length>mode.steps.length||list.some(a=>typeof a!=='string'))throw new RangeError('途中記録が不正です。');
    let state=createTransaction(id);for(const action of list){const next=stepTransaction(state,action);if(next.index!==state.index+1)throw new RangeError('途中記録が不正です。');state=next;}states[id]=state;actions[id]=list.slice();
  }return {selected:saved.selected,states,actions};
}
