export const isolationLevel={id:'shared-ledger',number:'38',kind:'isolation',name:'二人で読む台帳',tag:'トランザクションの分離',title:'消えた数字を追いかける',story:'薬師が台帳を書き換えている間に、配達人が残りの薬を確かめようとしています。確定前の記録を読んだら何が起きるでしょう。'};
export const isolationModes={dirty:{name:'未確定の値も読める'},committed:{name:'確定済みの値だけ読む'}};
export function createIsolation(mode){
  if(!Object.hasOwn(isolationModes,mode))throw new RangeError('未知の読み方です。');
  return {mode,index:0,committed:10,pending:null,observed:null,message:'薬師に作業を始めてもらいましょう。'};
}
export function isolationAction(state,action){
  if(!['update','read7','read10','rollback'].includes(action)||state.index>=3)throw new RangeError('操作できません。');
  if(state.index===0&&action==='update')return {...state,index:1,pending:7,message:'薬師は10から３個減らしました。まだ確定していません。'};
  if(state.index===1&&(action==='read7'||action==='read10')){
    const expected=state.mode==='dirty'?7:10;
    if(Number(action.slice(4))!==expected)return {...state,message:state.mode==='dirty'?'この読み方では、確定前の作業中の値も見えます。':'この読み方では、未確定の値ではなく前に確定した値を読みます。'};
    return {...state,index:2,observed:expected,message:`配達人は ${expected} 個と読み取りました。`};
  }
  if(state.index===2&&action==='rollback')return {...state,index:3,pending:null,message:'薬師は変更を取り消しました。確定済みの台帳は10個のままです。'};
  return {...state,message:state.index===0?'最初に薬師の更新を始めましょう。':state.index===1?'配達人が読む値を予測しましょう。':'薬師の変更を取り消しましょう。'};
}
export function restoreIsolation(saved){
  if(!saved||!Object.hasOwn(isolationModes,saved.selected)||!saved.actions)throw new RangeError('途中記録が不正です。');
  const states={},actions={};
  for(const mode of Object.keys(isolationModes)){
    const list=saved.actions[mode];if(!Array.isArray(list)||list.length>3)throw new RangeError('途中記録が不正です。');
    let state=createIsolation(mode);
    for(const action of list){const next=isolationAction(state,action);if(next.index!==state.index+1)throw new RangeError('途中記録が不正です。');state=next;}
    states[mode]=state;actions[mode]=list.slice();
  }
  return {selected:saved.selected,states,actions};
}
export function isolationComplete(value){return Object.values(value.states).every(state=>state.index===3);}
