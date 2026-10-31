export const expeditionLevel={id:'lantern-expedition',number:'100',kind:'expedition',name:'灯火の塔への遠征',tag:'状態と行動の計画',title:'塔の灯りを取り戻す',story:'道が変わる遺跡へ向かい、鍵と水晶を集めて紋章を起動し、灯火の塔へたどり着きましょう。'};
export const expeditionRooms={S:'野営地',K:'鍵の祭壇',A:'紋章の間',R:'水晶の泉',G:'塔の扉'};
export const expeditionMaps={old:{name:'古い道',budget:6,edges:[['S','K'],['S','A'],['A','R'],['A','G']]},bridge:{name:'新しい橋',budget:5,edges:[['S','K'],['K','A'],['A','R'],['A','G']]}};
export function expeditionNeighbors(id,place){if(!Object.hasOwn(expeditionMaps,id)||!Object.hasOwn(expeditionRooms,place))throw new RangeError('場所が不正です。');return expeditionMaps[id].edges.flatMap(([a,b])=>a===place?[b]:b===place?[a]:[]);}
export function createExpeditionTrial(id){if(!Object.hasOwn(expeditionMaps,id))throw new RangeError('地図が不正です。');return {id,place:'S',key:false,rune:false,active:false,remaining:expeditionMaps[id].budget,status:'playing',history:[],message:'祭壇と泉で道具を集めましょう。'};}
export function expeditionStep(state,action){
  if(state.status!=='playing'||typeof action!=='string')throw new RangeError('操作できません。');
  if(action==='activate'){
    if(state.place!=='A'||!state.key||!state.rune||state.active)return {...state,message:'紋章の間で、鍵と水晶が両方そろっている必要があります。'};
    return {...state,active:true,history:[...state.history,action],message:'鍵と水晶で紋章を起動しました。塔へ向かいましょう。'};
  }
  if(!expeditionNeighbors(state.id,state.place).includes(action))throw new RangeError('その場所へ進めません。');
  if(action==='G'&&!state.active)return {...state,message:'塔の扉は閉じています。鍵と水晶で紋章を起動しましょう。'};
  const remaining=state.remaining-1,key=state.key||action==='K',rune=state.rune||action==='R',status=action==='G'?'found':remaining===0?'failed':'playing';
  return {...state,place:action,key,rune,remaining,status,history:[...state.history,action],message:status==='found'?'塔の灯りにたどり着きました！':status==='failed'?'灯りが尽きました。道を見直して再挑戦しましょう。':action==='K'&&!state.key?'祭壇で鍵を手に入れました。':action==='R'&&!state.rune?'泉で水晶を手に入れました。':`${expeditionRooms[action]}へ進みました。`};
}
export function createExpedition(){return {selected:'old',states:Object.fromEntries(Object.keys(expeditionMaps).map(id=>[id,createExpeditionTrial(id)]))};}
export function restoreExpedition(saved){if(!saved||!Object.hasOwn(expeditionMaps,saved.selected)||!saved.histories)throw new RangeError('途中記録が不正です。');const result=createExpedition();result.selected=saved.selected;for(const id of Object.keys(expeditionMaps)){const history=saved.histories[id];if(!Array.isArray(history)||history.length>expeditionMaps[id].budget+1)throw new RangeError('途中記録が不正です。');for(const action of history){const before=result.states[id],next=expeditionStep(before,action);if(next.history.length!==before.history.length+1)throw new RangeError('途中記録が不正です。');result.states[id]=next;}}return result;}
export function expeditionComplete(set){return Object.values(set.states).every(state=>state.status==='found');}
