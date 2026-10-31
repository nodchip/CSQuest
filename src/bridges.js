export const bridgeLevel={id:'village-bridges',number:'32',kind:'bridges',name:'村を結ぶ橋',tag:'最小全域木',title:'五つの村をつなごう',story:'川で隔てられた五つの村を、できるだけ少ない建設費ですべて結びます。候補の橋を安い順に調べ、輪を作る橋は見送りましょう。'};
export const villages=['A','B','C','D','E'];
export const bridgeScenarios={
  river:{name:'川の集落',edges:[{id:'AB',a:'A',b:'B',cost:1},{id:'BC',a:'B',b:'C',cost:2},{id:'AC',a:'A',b:'C',cost:3},{id:'CD',a:'C',b:'D',cost:4},{id:'BD',a:'B',b:'D',cost:5},{id:'DE',a:'D',b:'E',cost:6},{id:'CE',a:'C',b:'E',cost:7},{id:'AE',a:'A',b:'E',cost:8}]},
  valley:{name:'谷の集落',edges:[{id:'AE',a:'A',b:'E',cost:1},{id:'DE',a:'D',b:'E',cost:2},{id:'AD',a:'A',b:'D',cost:3},{id:'BC',a:'B',b:'C',cost:4},{id:'CD',a:'C',b:'D',cost:5},{id:'AB',a:'A',b:'B',cost:6},{id:'BE',a:'B',b:'E',cost:7},{id:'CE',a:'C',b:'E',cost:8}]},
};
export function createBridges(scenario){if(!Object.hasOwn(bridgeScenarios,scenario))throw new RangeError('未知の集落です。');return {scenario,processed:[],chosen:[],candidate:null,status:'playing',message:'一番安い未確認の橋を選びましょう。'};}
export function components(state){
  const edges=bridgeScenarios[state.scenario].edges.filter(edge=>state.chosen.includes(edge.id));const unseen=new Set(villages),groups=[];
  while(unseen.size){const group=[],pending=[unseen.values().next().value];unseen.delete(pending[0]);while(pending.length){const v=pending.pop();group.push(v);for(const edge of edges){const other=edge.a===v?edge.b:edge.b===v?edge.a:null;if(other&&unseen.has(other)){unseen.delete(other);pending.push(other);}}}groups.push(group.sort());}
  return groups;
}
export function formsCycle(state,edge){return components(state).some(group=>group.includes(edge.a)&&group.includes(edge.b));}
export function selectBridge(state,id){
  if(state.status!=='playing'||state.candidate!==null)throw new RangeError('橋を選べません。');
  const edges=bridgeScenarios[state.scenario].edges;const edge=edges.find(item=>item.id===id);
  if(!edge||state.processed.includes(id))throw new RangeError('未知または確認済みの橋です。');
  const cheapest=edges.find(item=>!state.processed.includes(item.id));
  if(edge.id!==cheapest.id)return {...state,message:`${edge.id} より安い未確認の橋があります。`};
  return {...state,candidate:id,message:`橋 ${id} を調べます。すでにつながっている二つの村か確認しましょう。`};
}
export function decideBridge(state,decision){
  if(state.status!=='playing'||state.candidate===null||!['take','skip'].includes(decision))throw new RangeError('判断できません。');
  const edge=bridgeScenarios[state.scenario].edges.find(item=>item.id===state.candidate),cycle=formsCycle(state,edge);
  if((decision==='skip')!==cycle)return {...state,message:cycle?'この二つの村はすでに橋でつながっています。新しい橋を加えると輪になります。':'この二つの村はまだつながっていません。橋を加えると別々の集まりがつながります。'};
  const chosen=cycle?state.chosen:[...state.chosen,edge.id],processed=[...state.processed,edge.id],done=chosen.length===villages.length-1;
  return {...state,chosen,processed,candidate:null,status:done?'done':'playing',message:done?'すべての村がつながりました！':cycle?`橋 ${edge.id} は輪になるので見送りました。`:`橋 ${edge.id} を建てました。`};
}
export function bridgeCost(state){const edges=bridgeScenarios[state.scenario].edges;return state.chosen.reduce((sum,id)=>sum+edges.find(edge=>edge.id===id).cost,0);}
export function restoreBridges(saved){
  if(!saved||!Object.hasOwn(bridgeScenarios,saved.selected)||!saved.actions)throw new RangeError('途中記録が不正です。');
  const states={},actions={};
  for(const id of Object.keys(bridgeScenarios)){
    const list=saved.actions[id];if(!Array.isArray(list)||list.length>16||list.some(x=>typeof x!=='string'))throw new RangeError('途中記録が不正です。');
    let state=createBridges(id);for(const action of list){const next=action.startsWith('edge:')?selectBridge(state,action.slice(5)):decideBridge(state,action);if(next.candidate===state.candidate&&next.processed.length===state.processed.length)throw new RangeError('途中記録が不正です。');state=next;}states[id]=state;actions[id]=list.slice();
  }
  return {selected:saved.selected,states,actions};
}
