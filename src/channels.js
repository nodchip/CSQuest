export const channelLevel={id:'forge-message-channel',number:'129',kind:'channel',name:'二人の精霊と伝言箱',tag:'通信路とバッファ',title:'伝言を二つ届けよう',story:'炉の精霊が伝言を二つ送り、記録係の精霊が受け取ります。伝言箱の大きさを変え、互いの待ち方を比べましょう。'};
export const channelModes={rendezvous:{name:'箱なし（容量０）',capacity:0},buffered:{name:'１通入る箱（容量１）',capacity:1}};
export const channelMessages=['赤の伝言','青の伝言'];
export function createChannelTrial(id){if(!Object.hasOwn(channelModes,id))throw new RangeError('通信路が不正です。');return {id,next:0,queue:[],pending:null,received:[],blockedSeen:false,history:[],message:'送り手と受け手を操作しましょう。'};}
export function channelStep(state,action){
 if(!['send','receive'].includes(action))throw new RangeError('操作が不正です。');
 const s={...state,queue:state.queue.slice(),received:state.received.slice(),history:state.history.slice()};
 if(action==='send'){
  if(s.pending!==null)return {...s,message:'送り手は前の送信が終わるのを待っています。'};
  if(s.next===channelMessages.length)return {...s,message:'送る伝言はもうありません。'};
  const message=channelMessages[s.next++];s.history.push(action);
  if(s.queue.length<channelModes[s.id].capacity){s.queue.push(message);s.message=`${message}を箱に入れました。`;}
  else{s.pending=message;s.blockedSeen=true;s.message=`${message}を送ろうとしましたが、受け手を待っています。`;}
 }else{
  if(s.queue.length){const message=s.queue.shift();s.received.push(message);s.history.push(action);if(s.pending!==null){s.queue.push(s.pending);s.pending=null;s.message=`${message}を受け取り、待っていた伝言が箱に入りました。`;}else s.message=`${message}を受け取りました。`;}
  else if(s.pending!==null){const message=s.pending;s.pending=null;s.received.push(message);s.history.push(action);s.message=`${message}を直接受け取り、送り手の待ちが終わりました。`;}
  else return {...s,message:'受け取れる伝言はまだありません。'};
 }
 return s;
}
export function createChannels(){return {selected:'rendezvous',states:Object.fromEntries(Object.keys(channelModes).map(id=>[id,createChannelTrial(id)]))};}
export function channelTrialComplete(s){return s.blockedSeen&&s.pending===null&&s.queue.length===0&&s.received.length===channelMessages.length&&s.received.every((x,i)=>x===channelMessages[i]);}
export function channelsComplete(s){return Object.keys(channelModes).every(id=>channelTrialComplete(s.states[id]));}
export function restoreChannels(saved){if(!saved||!Object.hasOwn(channelModes,saved.selected)||!saved.histories)throw new RangeError('途中記録が不正です。');const result=createChannels();result.selected=saved.selected;for(const id of Object.keys(channelModes)){const actions=saved.histories[id];if(!Array.isArray(actions)||actions.length>4)throw new RangeError('履歴が不正です。');for(const action of actions){const before=result.states[id],after=channelStep(before,action);if(after.history.length!==before.history.length+1)throw new RangeError('履歴が不正です。');result.states[id]=after;}}return result;}
