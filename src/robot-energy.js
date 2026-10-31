export const energyLevel={id:'automaton-energy',number:'71',kind:'energy',name:'自動人形と充電の道',tag:'経路計画と資源制約',title:'人形を充電所へ導こう',story:'自動人形が薬草を届けます。残りの力と地形を見ながら、充電所を通って目的地まで導きましょう。'};
export const energyMaps={upper:{name:'丘の充電所',max:4,initial:4,charger:[2,0],walls:[[2,1]],water:[]},lower:{name:'川辺の充電所',max:5,initial:4,charger:[1,2],walls:[[2,1],[2,0],[3,0]],water:[[2,2]]}};
export const energyDirections={north:{name:'北へ',dx:0,dy:-1},east:{name:'東へ',dx:1,dy:0},south:{name:'南へ',dx:0,dy:1},west:{name:'西へ',dx:-1,dy:0}};
export const ENERGY_MAX_ACTIONS=40;
const contains=(cells,x,y)=>cells.some(([a,b])=>a===x&&b===y);
export function energyCell(id,x,y){if(!Object.hasOwn(energyMaps,id)||!Number.isInteger(x)||!Number.isInteger(y)||x<0||x>=5||y<0||y>=3)throw new RangeError('地図の外です。');const m=energyMaps[id];return contains(m.walls,x,y)?'wall':contains(m.water,x,y)?'water':m.charger[0]===x&&m.charger[1]===y?'charger':x===4&&y===1?'goal':'floor';}
export function createEnergy(id){if(!Object.hasOwn(energyMaps,id))throw new RangeError('未知の通路です。');return {id,x:0,y:1,energy:energyMaps[id].initial,charged:false,status:'playing',history:[],message:'地図と残りの力を見て進みましょう。'};}
export function energyStep(state,action){
  if(state.status!=='playing'||(!Object.hasOwn(energyDirections,action)&&action!=='charge'))throw new RangeError('操作できません。');const map=energyMaps[state.id];
  if(action==='charge'){
    if(energyCell(state.id,state.x,state.y)!=='charger')return {...state,message:'充電所に着いてから充電できます。'};
    if(state.charged)return {...state,message:'この通路の充電所はすでに使いました。'};
    const history=[...state.history,action],failed=history.length>=ENERGY_MAX_ACTIONS;
    return {...state,energy:map.max,charged:true,history,status:failed?'failed':'playing',message:failed?'操作回数を使い切りました。道を考えて再挑戦しましょう。':`充電し、力が ${map.max} になりました。`};
  }
  const d=energyDirections[action],x=state.x+d.dx,y=state.y+d.dy;if(x<0||x>=5||y<0||y>=3)return {...state,message:'地図の外には進めません。'};
  const cell=energyCell(state.id,x,y);if(cell==='wall')return {...state,message:'そこには障害物があります。'};
  const cost=cell==='water'?2:1;if(state.energy<cost)return {...state,message:`その地形を進むには力が ${cost} 必要です。別の道を選ぶか、やり直しましょう。`};
  const energy=state.energy-cost,history=[...state.history,action],status=cell==='goal'?'found':energy===0&&cell!=='charger'||history.length>=ENERGY_MAX_ACTIONS?'failed':'playing';
  return {...state,x,y,energy,history,status,message:status==='found'?'薬草を届けました！':status==='failed'?'力または操作回数を使い切りました。道を考えて再挑戦しましょう。':cell==='charger'?'充電所に着きました。必要なら充電できます。':cell==='water'?'川を渡り、力を２使いました。':'一歩進み、力を１使いました。'};
}
export function createEnergySet(){return {selected:'upper',states:{upper:createEnergy('upper'),lower:createEnergy('lower')}};}
export function restoreEnergy(saved){
  if(!saved||!Object.hasOwn(energyMaps,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');const result=createEnergySet();result.selected=saved.selected;
  for(const id of Object.keys(energyMaps)){const history=saved.history[id];if(!Array.isArray(history)||history.length>ENERGY_MAX_ACTIONS)throw new RangeError('途中記録が不正です。');let state=createEnergy(id);for(const action of history){const next=energyStep(state,action);if(next.history.length!==state.history.length+1)throw new RangeError('途中記録が不正です。');state=next;}result.states[id]=state;}return result;
}
export function energyComplete(value){return Object.keys(energyMaps).every(id=>value.states[id].status==='found');}
