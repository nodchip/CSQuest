export const astarLevel={id:'guided-ruins',number:'42',kind:'astar',name:'星読みの道しるべ',tag:'ヒューリスティック探索',title:'遺跡への近道を探す',story:'星読みが、遺跡まで残りどれくらいかを見積もりました。今までの旅の費用と見積もりを使い、二つの方法で道を探しましょう。'};
// One-way roads with positive costs; the heuristic is consistent and admissible.
export const guidedRoads={S:{A:2,B:1},A:{C:2,G:7},B:{C:4,G:9},C:{G:2},G:{}};
export const guidedLabels={S:'出発地',A:'丘',B:'泉',C:'門',G:'遺跡'};
export const guidedHeuristic={S:6,A:4,B:6,C:2,G:0};
export const guidedModes={uniform:'残りの見積もりなし',astar:'星読みの見積もりあり'};
export function createGuided(mode){
  if(!Object.hasOwn(guidedModes,mode))throw new RangeError('未知の探索です。');
  return {mode,distances:{S:0,A:null,B:null,C:null,G:null},parents:{S:null},settled:[],status:'playing',message:'出発地から探索を始めましょう。'};
}
export function estimate(mode,id){if(!Object.hasOwn(guidedModes,mode)||!Object.hasOwn(guidedRoads,id))throw new RangeError('地点が不正です。');return mode==='astar'?guidedHeuristic[id]:0;}
export function advanceGuided(state,id){return advanceGuidedWith(state,id,estimate);}
export function advanceGuidedWith(state,id,heuristic,{reopen=false}={}){
  if(state.status!=='playing'||!Object.hasOwn(guidedRoads,id)||state.settled.includes(id)||state.distances[id]===null)throw new RangeError('選べない地点です。');
  const open=Object.keys(guidedRoads).filter(k=>!state.settled.includes(k)&&state.distances[k]!==null);
  const score=k=>state.distances[k]+heuristic(state.mode,k),minimum=Math.min(...open.map(score));
  if(score(id)!==minimum)return {...state,message:'候補の中で「ここまでの費用＋残りの見積もり」が最も小さい地点を選びましょう。'};
  let settled=[...state.settled,id];const distances={...state.distances},parents={...state.parents};
  if(id==='G')return {...state,settled,status:'found',message:`遺跡までの費用 ${distances.G} が決まりました。`};
  const updates=[];
  for(const [next,cost] of Object.entries(guidedRoads[id])){
    if(settled.includes(next)&&!reopen)continue;
    const candidate=distances[id]+cost;
    if(distances[next]===null||candidate<distances[next]){distances[next]=candidate;parents[next]=id;if(settled.includes(next))settled=settled.filter(place=>place!==next);updates.push(`${next} → ${candidate}`);}
  }
  return {...state,settled,distances,parents,message:updates.length?`${id} を調べ、候補を更新：${updates.join('、')}`:`${id} を調べました。候補の更新はありません。`};
}
export function guidedRoute(state){if(state.status!=='found')return null;const route=[];for(let id='G';id!==null;id=state.parents[id])route.push(id);return route.reverse();}
export function restoreGuided(saved){
  if(!saved||!Object.hasOwn(guidedModes,saved.selected)||!saved.actions)throw new RangeError('途中記録が不正です。');
  const states={},actions={};
  for(const mode of Object.keys(guidedModes)){
    const list=saved.actions[mode];if(!Array.isArray(list)||list.length>Object.keys(guidedRoads).length)throw new RangeError('途中記録が不正です。');
    let state=createGuided(mode);for(const id of list){const next=advanceGuided(state,id);if(next.settled.length!==state.settled.length+1)throw new RangeError('途中記録が不正です。');state=next;}states[mode]=state;actions[mode]=list.slice();
  }return {selected:saved.selected,states,actions};
}
