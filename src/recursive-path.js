import {edges,places} from './horn-routes.js';

export const recursivePathLevel={id:'ruin-recursive-path',number:'149',kind:'recursive-path',name:'遺跡をつなぐ道の約束',tag:'再帰的な関係',title:'道の約束を重ねよう',story:'遺跡のさらに奥へ行く道を見つけます。一歩の道をつなぎ、遠くの部屋まで届くか調べましょう。'};
export const pathPlaces={...places,f:'暁の間'};
export const pathEdges=[...edges,['e','f']];
export function createRecursivePath(){return {mode:'base',edge:0,path:0,paths:[],checked:false,message:'一歩の道を選び、基本の約束を使いましょう。'};}
export function deriveRecursivePath(state){
  if(!['base','extend'].includes(state.mode)||!Number.isInteger(state.edge)||state.edge<0||state.edge>=pathEdges.length)throw new RangeError('選択が不正です。');
  const edge=pathEdges[state.edge];let next;
  if(state.mode==='base')next=edge.slice();
  else {const path=state.paths[state.path];if(!path)return {...state,checked:false,message:'先に導いた道を選びましょう。'};if(path.at(-1)!==edge[0])return {...state,checked:false,message:'導いた道の到着地と、次の一歩の出発地を合わせましょう。'};next=[...path,edge[1]];}
  if(state.paths.some(p=>p.length===next.length&&p.every((x,i)=>x===next[i])))return {...state,checked:false,message:'その道はすでに導いています。'};
  return {...state,paths:[...state.paths,next],checked:false,message:`${next.map(x=>pathPlaces[x]).join(' → ')} を導きました。`};
}
export function checkRecursivePath(state){return {...state,checked:true,message:recursivePathsFound(state)?'月の間と暁の間への道を見つけました。':'灯りの間から月の間と暁の間への道を両方導きましょう。'};}
export function recursivePathsFound(state){return ['c','f'].every(to=>state.paths.some(p=>p[0]==='a'&&p.at(-1)===to));}
export function recursivePathComplete(state){return state.checked&&recursivePathsFound(state);}
export function restoreRecursivePath(saved){
  if(!saved||!['base','extend'].includes(saved.mode)||!Number.isInteger(saved.edge)||saved.edge<0||saved.edge>=pathEdges.length||!Number.isInteger(saved.path)||saved.path<0||!Array.isArray(saved.paths)||saved.paths.length>30||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
  let state=createRecursivePath();for(const path of saved.paths){if(!Array.isArray(path)||path.length<2||path.length>pathEdges.length+1)throw new RangeError('途中記録が不正です。');let mode,edge,index=0;if(path.length===2){mode='base';edge=pathEdges.findIndex(e=>e[0]===path[0]&&e[1]===path[1]);}else{mode='extend';edge=pathEdges.findIndex(e=>e[0]===path.at(-2)&&e[1]===path.at(-1));index=state.paths.findIndex(p=>p.length===path.length-1&&p.every((x,i)=>x===path[i]));}if(edge<0||index<0)throw new RangeError('途中記録が不正です。');const count=state.paths.length;state=deriveRecursivePath({...state,mode,edge,path:index});if(state.paths.length!==count+1||!state.paths.at(-1).every((x,i)=>x===path[i]))throw new RangeError('途中記録が不正です。');}
  if(saved.path>=Math.max(1,state.paths.length))throw new RangeError('途中記録が不正です。');state={...state,mode:saved.mode,edge:saved.edge,path:saved.path,message:'続きを調べましょう。'};return saved.checked?checkRecursivePath(state):state;
}
