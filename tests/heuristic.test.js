import test from 'node:test';
import assert from 'node:assert/strict';
import {guidedRoads,guidedRoute} from '../src/astar.js';
import {createHeuristic,stepHeuristic,heuristicValue,heuristicCorrect,restoreHeuristic,heuristicComplete} from '../src/heuristic.js';
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
  assert.equal(state.states.closed.distances.G,7);assert.equal(state.states.reopen.distances.G,6);assert.deepEqual(guidedRoute(state.states.reopen),['S','A','C','G']);assert.equal(heuristicComplete(state),true);
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
