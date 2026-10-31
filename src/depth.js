export const depthLevel={id:'depth-ruins',number:'21',kind:'depth',name:'遺跡の奥への道',tag:'深さ優先探索とスタック',title:'迷宮の足あと',story:'遺跡の奥に残された光を探します。分かれ道では名前の早い道から進み、行き止まりでは足あとをたどって戻りましょう。'};
// An undirected graph. Neighbor order is alphabetical for this exercise.
export const passages={S:['A','B'],A:['C','D','S'],B:['G','S'],C:['A'],D:['A','E'],E:['D','G'],G:['B','E']};
export const roomNames={S:'入口',A:'石の間',B:'泉の間',C:'行き止まり',D:'鏡の間',E:'祭壇',G:'光の間'};
export function createDepth(){return {stack:['S'],visited:['S'],status:'playing',message:'入口 S から出発します。'};}
export function depthAction(state,action){
  if(state.status!=='playing') throw new RangeError('探索は終了しています。');
  const current=state.stack.at(-1), candidates=passages[current].filter(room=>!state.visited.includes(room));
  if(action==='back'){
    if(candidates.length) return {...state,message:`まだ ${candidates.join('・')} に進めます。名前の早い地点から調べましょう。`};
    if(state.stack.length===1) return {...state,message:'入口まで戻りました。進める道はありません。'};
    const stack=state.stack.slice(0,-1);
    return {...state,stack,message:`${current} は行き止まり。最後の足あとを外し、${stack.at(-1)} に戻りました。`};
  }
  if(!passages[current].includes(action)) throw new RangeError('隣接していない地点です。');
  if(state.visited.includes(action)) return {...state,message:`${action} は調査済みです。同じ地点には再び入りません。`};
  if(action!==candidates[0]) return {...state,message:`名前の早い ${candidates[0]} から進みましょう。`};
  return {stack:[...state.stack,action],visited:[...state.visited,action],status:action==='G'?'found':'playing',message:action==='G'?'光の間にたどり着きました！':`${action} に進み、足あとを積みました。`};
}
export function restoreDepth(actions){
  if(!Array.isArray(actions)||actions.length>2*Object.keys(passages).length) throw new RangeError('途中記録が不正です。');
  return actions.reduce((state,action)=>{if(typeof action!=='string')throw new RangeError('途中記録が不正です。');const next=depthAction(state,action);if(next.stack===state.stack)throw new RangeError('途中記録が不正です。');return next;},createDepth());
}
