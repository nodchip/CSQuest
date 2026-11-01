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
const stateId=(place,key)=>`${place}${key?'1':'0'}`;
export function createKeySearch(){return {queue:['S0'],nodes:{S0:{place:'S',key:false,distance:0,parent:null}},edges:[],history:[],done:false,message:'入口・鍵なしから始めます。'};}
export function expandKeySearch(s,id){
 if(s.done||s.queue.length===0||s.history.length>=20)return {ok:false,message:'探索は終了しています。'};
 if(id!==s.queue[0])return {ok:false,message:'幅優先では待機列の先頭を選びましょう。'};
 const here=s.nodes[id],queue=s.queue.slice(1),nodes={...s.nodes},edges=[...s.edges],history=[...s.history,id];
 if(here.place==='G')return {ok:true,state:{queue,nodes,edges,history,done:true,message:`門に到着。最短の移動回数は ${here.distance} です。`}};
 const added=[];for(const place of mazeNeighbors('return',here.place)){if(place==='G'&&!here.key)continue;const key=here.key||place==='K',next=stateId(place,key),edge=`${id}>${next}`;if(!edges.includes(edge))edges.push(edge);if(!Object.hasOwn(nodes,next)){nodes[next]={place,key,distance:here.distance+1,parent:id};queue.push(next);added.push(next);}}
 return {ok:true,state:{queue,nodes,edges,history,done:false,message:added.length?`新たに ${added.join('・')} を発見しました。`:'新しい状態はありません。'}};
}
export function keySearchPath(s){if(!s.done)return null;const path=[];for(let id='G1';id!==null;id=s.nodes[id].parent)path.push(id);return path.reverse();}
export function createKeyMazeSet(){return {selected:'bridge',states:Object.fromEntries(Object.keys(keyMazes).map(id=>[id,createKeyMaze(id)])),search:createKeySearch(),searchAnswer:null,searchChecked:false};}
export function restoreKeyMaze(saved){
  if(!saved||!Object.hasOwn(keyMazes,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');const result=createKeyMazeSet();result.selected=saved.selected;
  for(const id of Object.keys(keyMazes)){const history=saved.history[id];if(!Array.isArray(history)||history.length>keyMazes[id].budget)throw new RangeError('途中記録が不正です。');for(const next of history){const before=result.states[id],after=keyMazeStep(before,next);if(after.history.length!==before.history.length+1)throw new RangeError('途中記録が不正です。');result.states[id]=after;}}
  const history=saved.searchHistory??[],answer=saved.searchAnswer??null,checked=saved.searchChecked??false;if(!Array.isArray(history)||history.length>20||![null,'state','room'].includes(answer)||typeof checked!=='boolean')throw new RangeError('途中記録が不正です。');for(const id of history){const r=expandKeySearch(result.search,id);if(!r.ok)throw new RangeError('途中記録が不正です。');result.search=r.state;}result.searchAnswer=answer;result.searchChecked=checked;return result;
}
export function keyMazeComplete(value){return Object.values(value.states).every(s=>s.status==='found')&&value.search.done&&value.searchAnswer==='state'&&value.searchChecked;}
