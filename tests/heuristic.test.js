import test from 'node:test';
import assert from 'node:assert/strict';
import {guidedRoads,guidedRoute} from '../src/astar.js';
import {createHeuristic,stepHeuristic,heuristicValue,heuristicCorrect,checkConstructedEstimate,stepConstructed,restoreHeuristic,heuristicComplete} from '../src/heuristic.js';
function cheapest(id){return id==='G'?0:Math.min(...Object.entries(guidedRoads[id]).map(([next,cost])=>cost+cheapest(next)));}
test('the new estimates exceed the independently enumerated true cost exactly at A and C',()=>{
  const excess=Object.keys(guidedRoads).filter(id=>heuristicValue('overestimate',id)>cheapest(id));
  assert.deepEqual(excess,['A','C']);assert.equal(heuristicCorrect(excess),true);assert.equal(heuristicCorrect(['A']),false);
});
test('overestimation can stop at a suboptimal goal while the reliable estimate finds the shortest',()=>{
  const state=createHeuristic();
  for(const id of ['S','A','C','G'])state.states.reliable=stepHeuristic('reliable',state.states.reliable,id);
  for(const id of ['S','B','G'])state.states.overestimate=stepHeuristic('overestimate',state.states.overestimate,id);
  assert.equal(state.states.reliable.distances.G,cheapest('S'));assert.equal(state.states.overestimate.distances.G,10);
  assert.deepEqual(guidedRoute(state.states.overestimate),['S','B','G']);
  state.guesses=['A','C'];state.checked=true;assert.equal(heuristicComplete(state),false);
  for(const id of ['S','B','C','A','G'])state.states.closed=stepHeuristic('closed',state.states.closed,id);
  for(const id of ['S','B','C','A','C','G'])state.states.reopen=stepHeuristic('reopen',state.states.reopen,id);
  assert.equal(state.states.closed.distances.G,7);assert.equal(state.states.reopen.distances.G,6);assert.deepEqual(guidedRoute(state.states.reopen),['S','A','C','G']);assert.equal(heuristicComplete(state),false);
  for(const id of ['S','B','G'])state.states.greedy=stepHeuristic('greedy',state.states.greedy,id);
  for(const id of ['S','B','A','C','G'])state.states.greedyAstar=stepHeuristic('greedyAstar',state.states.greedyAstar,id);
  assert.equal(heuristicComplete(state),true);
});
test('greedy and A* use the same consistent admissible estimate but rank candidates differently',()=>{
 for(const id of Object.keys(guidedRoads)){assert.equal(heuristicValue('greedy',id),heuristicValue('greedyAstar',id));assert.ok(heuristicValue('greedy',id)<=cheapest(id));for(const [next,cost] of Object.entries(guidedRoads[id]))assert.ok(heuristicValue('greedy',id)<=cost+heuristicValue('greedy',next));}
 const s=createHeuristic();for(const id of ['S','B','G'])s.states.greedy=stepHeuristic('greedy',s.states.greedy,id);for(const id of ['S','B','A','C','G'])s.states.greedyAstar=stepHeuristic('greedyAstar',s.states.greedyAstar,id);
 assert.equal(s.states.greedy.distances.G,10);assert.equal(s.states.greedyAstar.distances.G,6);assert.deepEqual(guidedRoute(s.states.greedy),['S','B','G']);
});
test('partial saved trials replay and reject wrong priorities',()=>{
  const saved={selected:'overestimate',actions:{reliable:['S','A'],overestimate:['S','B']},guesses:['A'],checked:true};
  assert.equal(restoreHeuristic(saved).states.overestimate.distances.G,10);
  assert.throws(()=>restoreHeuristic({...saved,actions:{reliable:[],overestimate:['S','A']}}),RangeError);
  assert.throws(()=>restoreHeuristic({...saved,guesses:['A','A']}),RangeError);
});
test('admissible but inconsistent heuristic requires reopening in this graph',()=>{
 for(const id of Object.keys(guidedRoads))assert.ok(heuristicValue('closed',id)<=cheapest(id));
 assert.ok(heuristicValue('closed','A')>guidedRoads.A.C+heuristicValue('closed','C'));
 const actions={reliable:[],overestimate:[],closed:['S','B','C','A','G'],reopen:['S','B','C','A','C','G']};
 const state=restoreHeuristic({selected:'reopen',actions,guesses:[],checked:false});assert.equal(state.states.closed.distances.G,7);assert.equal(state.states.reopen.distances.G,6);assert.deepEqual(state.actions.reopen,actions.reopen);
 const partial=restoreHeuristic({selected:'reopen',actions:{...actions,reopen:['S','B','C','A']},guesses:[],checked:false});assert.equal(partial.states.reopen.distances.C,4);assert.equal(partial.states.reopen.settled.includes('C'),false);
});

test('constructed estimates distinguish overestimation from inconsistency and restore independently',()=>{
 assert.deepEqual(checkConstructedEstimate({S:0,A:4,B:0,C:0,G:0}),{over:[],inconsistent:['A→C']});
 assert.deepEqual(checkConstructedEstimate({S:6,A:4,B:6,C:2,G:0}),{over:[],inconsistent:[]});
 assert.deepEqual(checkConstructedEstimate({S:0,A:10,B:0,C:10,G:0}),{over:['A','C'],inconsistent:['A→G','C→G']});
 assert.deepEqual(checkConstructedEstimate({S:0,A:0,B:0,C:0,G:1}),{over:['G'],inconsistent:['G（遺跡の見積もりは０）']});
 assert.throws(()=>checkConstructedEstimate({S:0,A:-1,B:0,C:0,G:0}),RangeError);
 const q=createHeuristic(),draft={selected:q.selected,actions:q.actions,guesses:[],checked:false,constructed:{S:0,A:4,B:0,C:0,G:0},constructedChecked:true};const restored=restoreHeuristic(draft);assert.equal(restored.constructedChecked,true);restored.constructed.A=0;assert.equal(draft.constructed.A,4);assert.deepEqual(restoreHeuristic({...draft,constructed:undefined}).constructed,{S:0,A:0,B:0,C:0,G:0});assert.throws(()=>restoreHeuristic({...draft,constructed:{...draft.constructed,A:11}}),RangeError);
});

test('constructed estimates drive A* with reopening and saved actions are replayed',()=>{
 const draft=createHeuristic();draft.constructed={S:0,A:4,B:0,C:0,G:0};draft.constructedActions=['S','B','C','A','C','G'];
 const restored=restoreHeuristic(draft);assert.equal(restored.constructedState.distances.G,6);assert.deepEqual(guidedRoute(restored.constructedState),['S','A','C','G']);
 const over={...draft,constructed:{S:0,A:10,B:0,C:10,G:0},constructedActions:['S','B','G']};assert.equal(restoreHeuristic(over).constructedState.distances.G,10);
 assert.throws(()=>restoreHeuristic({...over,constructedActions:['S','A']}),RangeError);
 const initial=createHeuristic();assert.throws(()=>stepConstructed(initial.constructed,initial.constructedState,'A'),RangeError);
});
