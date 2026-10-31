export const containersLevel={id:'guild-containers',number:'79',kind:'containers',name:'荷物と足あとの道具箱',tag:'待ち行列とスタック',title:'道具箱の順番を比べよう',story:'ギルドに届く荷物と迷宮の足あとでは、取り出したい順番が違います。同じ出し入れを二つの道具箱で試しましょう。'};
export const containerModes={queue:'待ち行列：先に入れたものから',stack:'スタック：後に入れたものから'};
export const containerCases={delivery:{name:'荷物の受付',goal:'届いた順に取り出す',mode:'queue'},footsteps:{name:'迷宮の足あと',goal:'まだ残る中で最後に記録したものから戻る',mode:'stack'}};
export const containerEvents=[{put:'A'},{put:'B'},{put:'C'},{take:true},{put:'D'},{take:true},{take:true},{take:true}];
export function createContainer(mode){if(!Object.hasOwn(containerModes,mode))throw new RangeError('未知の道具箱です。');return {mode,items:[],output:[],history:[],message:'最初の荷物を入れましょう。'};}
export function containerStep(state,action){
  const event=containerEvents[state.history.length];if(!event||typeof action!=='string')throw new RangeError('操作できません。');
  if(event.put){if(action!==`put:${event.put}`)throw new RangeError('今は別の操作です。');return {...state,items:[...state.items,event.put],history:[...state.history,action],message:`${event.put} を追加しました。`};}
  if(!/^take:[ABCD]$/.test(action))throw new RangeError('取り出す荷物を選んでください。');
  const expected=state.mode==='queue'?state.items[0]:state.items.at(-1),chosen=action.slice(5);
  if(chosen!==expected)return {...state,message:state.mode==='queue'?'待ち行列では、一番先に入ってまだ残る荷物を取り出します。':'スタックでは、一番後に入ってまだ残る荷物を取り出します。'};
  const items=state.mode==='queue'?state.items.slice(1):state.items.slice(0,-1);
  return {...state,items,output:[...state.output,expected],history:[...state.history,action],message:`${expected} を取り出しました。`};
}
export function createContainerSet(){return {selected:'delivery',states:{delivery:null,footsteps:null}};}
export function containerCorrect(id,state){return !!state&&state.history.length===containerEvents.length&&state.mode===containerCases[id].mode;}
export function containersComplete(set){return Object.keys(containerCases).every(id=>containerCorrect(id,set.states[id]));}
export function restoreContainers(saved){
  if(!saved||!Object.hasOwn(containerCases,saved.selected)||!saved.states)throw new RangeError('途中記録が不正です。');
  const result=createContainerSet();result.selected=saved.selected;
  for(const id of Object.keys(containerCases)){
    const entry=saved.states[id];if(entry===null)continue;
    if(!entry||!Object.hasOwn(containerModes,entry.mode)||!Array.isArray(entry.history)||entry.history.length>containerEvents.length)throw new RangeError('途中記録が不正です。');
    let state=createContainer(entry.mode);for(const action of entry.history){const next=containerStep(state,action);if(next.history.length!==state.history.length+1)throw new RangeError('途中記録が不正です。');state=next;}result.states[id]=state;
  }
  return result;
}
