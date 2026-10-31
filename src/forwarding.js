export const forwardingLevel={id:'routing-towers',number:'48',kind:'forwarding',name:'伝令塔の道しるべ',tag:'転送と経路',title:'手紙を迷わせない',story:'城へ手紙を送る三つの伝令塔で、次に渡す塔の決まりが食い違っています。各塔の道しるべを直して、どの塔からも手紙を届けましょう。'};
export const links={S:{A:1,B:1},A:{S:1,B:1,G:1},B:{S:1,A:1,G:4},G:{}};
export const towerNames={S:'森の塔',A:'丘の塔',B:'泉の塔',G:'城'};
export const starts={S:{name:'森の塔から',best:2},A:{name:'丘の塔から',best:1},B:{name:'泉の塔から',best:2}};
export const HOP_LIMIT=5;
export function validTable(table){return table&&Object.keys(starts).every(id=>typeof table[id]==='string'&&Object.hasOwn(links[id],table[id]));}
export function createPacket(start){if(!Object.hasOwn(starts,start))throw new RangeError('未知の出発地です。');return {start,current:start,path:[start],cost:0,hops:0,status:'traveling'};}
export function forwardPacket(table,state){
  if(!validTable(table)||state.status!=='traveling')throw new RangeError('転送できません。');
  const next=table[state.current],cost=state.cost+links[state.current][next],hops=state.hops+1,path=[...state.path,next];
  return {...state,current:next,path,cost,hops,status:next==='G'?'delivered':hops===HOP_LIMIT?'expired':'traveling'};
}
export function createForwarding(){return {selected:'S',table:{S:'B',A:'G',B:'S'},states:Object.fromEntries(Object.keys(starts).map(id=>[id,createPacket(id)]))};}
export function resetPackets(state){return {...state,states:Object.fromEntries(Object.keys(starts).map(id=>[id,createPacket(id)]))};}
export function restoreForwarding(saved){
  if(!saved||!Object.hasOwn(starts,saved.selected)||!validTable(saved.table)||!saved.hops)throw new RangeError('途中記録が不正です。');
  let state=createForwarding();state.selected=saved.selected;state.table=Object.fromEntries(Object.keys(starts).map(id=>[id,saved.table[id]]));
  for(const id of Object.keys(starts)){
    const count=saved.hops[id];if(!Number.isInteger(count)||count<0||count>HOP_LIMIT)throw new RangeError('途中記録が不正です。');
    let packet=createPacket(id);for(let i=0;i<count;i++)packet=forwardPacket(state.table,packet);state.states[id]=packet;
  }return state;
}
export function forwardingComplete(state){return Object.entries(starts).every(([id,task])=>state.states[id].status==='delivered'&&state.states[id].cost===task.best);}
