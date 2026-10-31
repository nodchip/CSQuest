export const keyMazeLevel={id:'key-return-maze',number:'85',kind:'keymaze',name:'鍵を持って戻る迷宮',tag:'状態空間と計画',title:'鍵を手に門へ向かおう',story:'迷宮の奥に閉じた門があります。限られた灯りの時間で鍵を見つけ、門までたどり着きましょう。'};
export const keyRooms={S:'入口',A:'分かれ道',K:'鍵の祭壇',G:'閉じた門'};
export const keyMazes={bridge:{name:'祭壇からの近道',budget:3,edges:[['S','A'],['S','K'],['K','A'],['A','G']]},return:{name:'入口へ戻る道',budget:4,edges:[['S','A'],['S','K'],['A','G']]}};
export function mazeNeighbors(id,place){if(!Object.hasOwn(keyMazes,id)||!Object.hasOwn(keyRooms,place))throw new RangeError('場所が不正です。');return keyMazes[id].edges.flatMap(([a,b])=>a===place?[b]:b===place?[a]:[]);}
export function createKeyMaze(id){if(!Object.hasOwn(keyMazes,id))throw new RangeError('未知の迷宮です。');return {id,place:'S',key:false,remaining:keyMazes[id].budget,status:'playing',history:[],message:'道と残り時間を見て、次の場所を選びましょう。'};}
export function keyMazeStep(state,next){
  if(state.status!=='playing'||!mazeNeighbors(state.id,state.place).includes(next))throw new RangeError('その場所には進めません。');
  if(next==='G'&&!state.key)return {...state,message:'門には鍵が必要です。鍵の祭壇を探しましょう。'};
  const key=state.key||next==='K',remaining=state.remaining-1,status=next==='G'?'found':remaining===0?'failed':'playing';
  return {...state,place:next,key,remaining,status,history:[...state.history,next],message:status==='found'?'鍵を使って門を開きました！':status==='failed'?'灯りの時間が尽きました。道を考えて再挑戦しましょう。':next==='K'&&!state.key?'祭壇で鍵を手に入れました。':` ${keyRooms[next]}に進みました。`};
}
export function createKeyMazeSet(){return {selected:'bridge',states:Object.fromEntries(Object.keys(keyMazes).map(id=>[id,createKeyMaze(id)]))};}
export function restoreKeyMaze(saved){
  if(!saved||!Object.hasOwn(keyMazes,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');const result=createKeyMazeSet();result.selected=saved.selected;
  for(const id of Object.keys(keyMazes)){const history=saved.history[id];if(!Array.isArray(history)||history.length>keyMazes[id].budget)throw new RangeError('途中記録が不正です。');for(const next of history){const before=result.states[id],after=keyMazeStep(before,next);if(after.history.length!==before.history.length+1)throw new RangeError('途中記録が不正です。');result.states[id]=after;}}
  return result;
}
export function keyMazeComplete(value){return Object.values(value.states).every(s=>s.status==='found');}
