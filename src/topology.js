export const topologyLevel={id:'festival-order',number:'56',kind:'topology',name:'祭りの支度の順番',tag:'トポロジカルソート',title:'精霊たちの準備をつなぐ',story:'祭りの準備には、先に終える必要のある仕事があります。矢印の約束を守って、支度を進めましょう。'};
export const topologyNodes={A:'会場を整える',B:'布を染める',C:'飾りを作る',D:'門を飾る',E:'旗を届ける'};
export const topologyCases={festival:{name:'祭りの準備',nodes:['A','B','C','D','E'],edges:[['A','C'],['B','C'],['C','D'],['B','E']]},loop:{name:'魔法の約束',nodes:['A','B','C','D'],edges:[['A','B'],['B','C'],['C','B'],['C','D']]}};
export function createTopology(id){if(!Object.hasOwn(topologyCases,id))throw new RangeError('未知の依頼です。');return {id,order:[],cycle:false,message:'先に必要な仕事がすべて終わったものを選びましょう。'};}
export function availableTopology(state){const task=topologyCases[state.id];return task.nodes.filter(id=>!state.order.includes(id)&&task.edges.every(([before,after])=>after!==id||state.order.includes(before)));}
export function topologyStep(state,choice){
  const task=topologyCases[state.id];if(state.cycle||state.order.length===task.nodes.length)throw new RangeError('試練は終了しています。');
  const available=availableTopology(state);
  if(choice==='stuck')return available.length?{...state,message:`まだ進められる仕事があります：${available.join('、')}。`}:{...state,cycle:true,message:'残った仕事の間に循環する依存関係があり、順番を完成できません。'};
  if(!task.nodes.includes(choice)||state.order.includes(choice))throw new RangeError('選べない仕事です。');
  const missing=task.edges.filter(([before,after])=>after===choice&&!state.order.includes(before)).map(([before])=>before);
  if(missing.length)return {...state,message:`${choice} より先に、${missing.join('、')} を終える必要があります。`};
  const order=[...state.order,choice];return {...state,order,message:order.length===task.nodes.length?'すべての仕事が終わりました。':`${choice} を終えました。次に進める仕事を探しましょう。`};
}
export function createTopologySet(){return {selected:'festival',states:{festival:createTopology('festival'),loop:createTopology('loop')}};}
export function restoreTopology(saved){
  if(!saved||!Object.hasOwn(topologyCases,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');
  const result=createTopologySet();result.selected=saved.selected;
  for(const id of Object.keys(topologyCases)){const history=saved.history[id];if(!Array.isArray(history)||history.length>topologyCases[id].nodes.length+1)throw new RangeError('途中記録が不正です。');let state=createTopology(id);for(const choice of history){const next=topologyStep(state,choice);if(next.order.length===state.order.length&&!next.cycle)throw new RangeError('途中記録が不正です。');state=next;}result.states[id]=state;}return result;
}
export function topologyComplete(value){return value.states.festival.order.length===topologyCases.festival.nodes.length&&value.states.loop.cycle;}
