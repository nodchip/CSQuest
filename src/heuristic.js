import {guidedRoads,guidedHeuristic,createGuided,advanceGuidedWith} from './astar.js';
export const heuristicLevel={id:'misleading-stars',number:'43',kind:'heuristic',name:'星読みの見積もりを疑え',tag:'見積もりの許容性',title:'遠く見える近道',story:'別の星読みが、同じ遺跡への道に違う見積もりを出しました。近道を遠く見積もると、探索はどうなるでしょう。'};
export const heuristicModes={reliable:'前の星読み',overestimate:'新しい星読み'};
export const misleading={S:0,A:10,B:0,C:10,G:0};
export function heuristicValue(mode,id){
  if(!Object.hasOwn(heuristicModes,mode)||!Object.hasOwn(guidedRoads,id))throw new RangeError('見積もりが不正です。');
  return mode==='reliable'?guidedHeuristic[id]:misleading[id];
}
export function heuristicCorrect(guesses){return guesses.length===2&&guesses.includes('A')&&guesses.includes('C');}
export function createHeuristic(){return {selected:'reliable',states:{reliable:createGuided('astar'),overestimate:createGuided('astar')},actions:{reliable:[],overestimate:[]},guesses:[],checked:false};}
export function stepHeuristic(mode,state,id){return advanceGuidedWith(state,id,(_,place)=>heuristicValue(mode,place));}
export function restoreHeuristic(saved){
  if(!saved||!Object.hasOwn(heuristicModes,saved.selected)||!saved.actions||!Array.isArray(saved.guesses)||new Set(saved.guesses).size!==saved.guesses.length||saved.guesses.some(id=>typeof id!=='string'||!Object.hasOwn(guidedRoads,id))||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
  const state=createHeuristic();state.selected=saved.selected;state.guesses=saved.guesses.slice();state.checked=saved.checked;
  for(const mode of Object.keys(heuristicModes)){
    const list=saved.actions[mode];if(!Array.isArray(list)||list.length>5)throw new RangeError('途中記録が不正です。');
    let trial=createGuided('astar');for(const id of list){const next=stepHeuristic(mode,trial,id);if(next.settled.length!==trial.settled.length+1)throw new RangeError('途中記録が不正です。');trial=next;}state.states[mode]=trial;state.actions[mode]=list.slice();
  }return state;
}
export function heuristicComplete(state){return state.checked&&heuristicCorrect(state.guesses)&&Object.values(state.states).every(trial=>trial.status==='found');}
