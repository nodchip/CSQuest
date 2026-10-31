export const constraintsLevel={id:'lantern-constraints',number:'49',kind:'constraints',name:'四つの塔の灯り',tag:'制約充足と後戻り',title:'遺跡の塔に色を灯す',story:'四つの塔に灯りを置きます。道でつながる塔は違う色にしなければならず、最後の塔には赤い灯りしか置けません。'};
export const towers=['A','B','C','D'];
export const colors={red:'赤',blue:'青',green:'緑'};
export const connections=[['A','B'],['A','C'],['B','C'],['A','D'],['C','D']];
export function available(assigned,tower){
  if(!towers.includes(tower))throw new RangeError('未知の塔です。');
  const domain=tower==='D'?['red']:Object.keys(colors),index=towers.indexOf(tower);
  if(index<assigned.length)return [];
  return domain.filter(color=>!connections.some(([a,b])=>{const neighbor=a===tower?b:b===tower?a:null;return neighbor!==null&&assigned[towers.indexOf(neighbor)]===color;}));
}
export function deadEnd(assigned){return towers.slice(assigned.length).some(tower=>available(assigned,tower).length===0);}
export function createConstraints(){return {assigned:[],witness:null,backtracked:false,message:'塔Ａから順に色を選びましょう。'};}
export function assignColor(state,color){
  if(!Object.hasOwn(colors,color)||state.assigned.length>=towers.length||deadEnd(state.assigned))throw new RangeError('色を選べません。');
  const tower=towers[state.assigned.length];
  if(!available(state.assigned,tower).includes(color))return {...state,message:`塔${tower}にはその色を置けません。つながる塔や、赤だけの条件を確認しましょう。`};
  const assigned=[...state.assigned,color],blocked=deadEnd(assigned);
  return {...state,assigned,witness:blocked?assigned.slice():state.witness,message:blocked?'先の塔に置ける色がなくなりました。一つ戻って選び直しましょう。':`塔${tower}に${colors[color]}を置きました。`};
}
export function undoColor(state){
  if(state.assigned.length===0)throw new RangeError('戻る色がありません。');
  return {...state,assigned:state.assigned.slice(0,-1),backtracked:state.backtracked||deadEnd(state.assigned),message:'一つ前に戻りました。別の色を試せます。'};
}
function replay(assigned){
  if(!Array.isArray(assigned)||assigned.length>towers.length)throw new RangeError('途中記録が不正です。');
  let state=createConstraints();for(const color of assigned){const next=assignColor(state,color);if(next.assigned.length!==state.assigned.length+1)throw new RangeError('途中記録が不正です。');state=next;}return state;
}
export function restoreConstraints(saved){
  if(!saved||typeof saved.backtracked!=='boolean')throw new RangeError('途中記録が不正です。');
  const current=replay(saved.assigned);current.witness=null;
  if(saved.witness!==null){const witness=replay(saved.witness);if(!deadEnd(witness.assigned))throw new RangeError('途中記録が不正です。');current.witness=witness.assigned.slice();}
  if(saved.backtracked&&current.witness===null)throw new RangeError('途中記録が不正です。');
  if(deadEnd(current.assigned)&&current.witness===null)throw new RangeError('途中記録が不正です。');
  current.backtracked=saved.backtracked;return current;
}
export function constraintsComplete(state){return state.assigned.length===towers.length&&!deadEnd(state.assigned)&&state.backtracked;}
