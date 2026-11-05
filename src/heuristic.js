import {guidedRoads,guidedHeuristic,createGuided,advanceGuidedWith} from './astar.js';
export const heuristicLevel={id:'misleading-stars',number:'43',kind:'heuristic',name:'星読みの見積もりを疑え',tag:'見積もりの許容性',title:'遠く見える近道',story:'別の星読みが、同じ遺跡への道に違う見積もりを出しました。近道を遠く見積もると、探索はどうなるでしょう。'};
export const heuristicModes={reliable:'前の星読み',overestimate:'過大な星読み',closed:'整合しない星読み・再展開なし',reopen:'整合しない星読み・再展開あり',greedy:'同じ星読み・貪欲探索',greedyAstar:'同じ星読み・A*'};
export const misleading={S:0,A:10,B:0,C:10,G:0};
export const inconsistent={S:0,A:4,B:0,C:0,G:0};
export const sharedEstimate={S:0,A:4,B:0,C:2,G:0};
export function heuristicValue(mode,id){
  if(!Object.hasOwn(heuristicModes,mode)||!Object.hasOwn(guidedRoads,id))throw new RangeError('見積もりが不正です。');
  return mode==='reliable'?guidedHeuristic[id]:mode==='overestimate'?misleading[id]:mode==='greedy'||mode==='greedyAstar'?sharedEstimate[id]:inconsistent[id];
}
export function heuristicCorrect(guesses){return guesses.length===2&&guesses.includes('A')&&guesses.includes('C');}
// This fixed road network is acyclic; enumerate paths to the goal for comparison.
function remainingCost(id){return id==='G'?0:Math.min(...Object.entries(guidedRoads[id]).map(([next,cost])=>cost+remainingCost(next)));}
export function checkConstructedEstimate(values){
  const nodes=Object.keys(guidedRoads);
  if(!values||!nodes.every(id=>Number.isInteger(values[id])&&values[id]>=0&&values[id]<=10))throw new RangeError('見積もりが不正です。');
  const over=nodes.filter(id=>values[id]>remainingCost(id));
  const inconsistent=nodes.flatMap(from=>Object.entries(guidedRoads[from]).filter(([to,cost])=>values[from]>cost+values[to]).map(([to])=>`${from}→${to}`));
  if(values.G!==0)inconsistent.push('G（遺跡の見積もりは０）');
  return {over,inconsistent};
}
export function createHeuristic(){return {selected:'reliable',states:Object.fromEntries(Object.keys(heuristicModes).map(k=>[k,createGuided('astar')])),actions:Object.fromEntries(Object.keys(heuristicModes).map(k=>[k,[]])),guesses:[],checked:false,constructed:{S:0,A:0,B:0,C:0,G:0},constructedChecked:false};}
export function stepHeuristic(mode,state,id){return advanceGuidedWith(state,id,(_,place)=>heuristicValue(mode,place),{reopen:mode==='reopen',heuristicOnly:mode==='greedy'});}
export function restoreHeuristic(saved){
  if(!saved||!Object.hasOwn(heuristicModes,saved.selected)||!saved.actions||!Array.isArray(saved.guesses)||new Set(saved.guesses).size!==saved.guesses.length||saved.guesses.some(id=>typeof id!=='string'||!Object.hasOwn(guidedRoads,id))||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
  const state=createHeuristic();if(saved.constructed!==undefined){checkConstructedEstimate(saved.constructed);state.constructed=Object.fromEntries(Object.keys(guidedRoads).map(k=>[k,saved.constructed[k]]));}if(saved.constructedChecked!==undefined&&typeof saved.constructedChecked!=='boolean')throw new RangeError('途中記録が不正です。');state.constructedChecked=saved.constructedChecked??false;state.selected=saved.selected;state.guesses=saved.guesses.slice();state.checked=saved.checked;
  for(const mode of Object.keys(heuristicModes)){
    const list=saved.actions[mode]??(['closed','reopen','greedy','greedyAstar'].includes(mode)?[]:null);if(!Array.isArray(list)||list.length>20)throw new RangeError('途中記録が不正です。');
    let trial=createGuided('astar');for(const id of list){const next=stepHeuristic(mode,trial,id);if(trial.settled.includes(id)||!next.settled.includes(id))throw new RangeError('途中記録が不正です。');trial=next;}state.states[mode]=trial;state.actions[mode]=list.slice();
  }return state;
}
export function heuristicComplete(state){return state.checked&&heuristicCorrect(state.guesses)&&Object.values(state.states).every(trial=>trial.status==='found');}
