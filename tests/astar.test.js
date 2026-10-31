import test from 'node:test';
import assert from 'node:assert/strict';
import {guidedRoads,guidedHeuristic,createGuided,advanceGuided,guidedRoute,restoreGuided} from '../src/astar.js';
function play(mode,path){return path.reduce(advanceGuided,createGuided(mode));}
function allPaths(node,seen=[]){if(node==='G')return [0];return Object.entries(guidedRoads[node]).filter(([next])=>!seen.includes(next)).flatMap(([next,cost])=>allPaths(next,[...seen,node]).map(rest=>rest+cost));}
test('the heuristic is bounded by true shortest costs and consistent on every road',()=>{
  for(const id of Object.keys(guidedRoads)){
    assert.ok(guidedHeuristic[id]<=Math.min(...allPaths(id)));
    for(const [next,cost] of Object.entries(guidedRoads[id]))assert.ok(guidedHeuristic[id]<=cost+guidedHeuristic[next]);
  }
});
test('both search modes find the optimal route while guided search expands fewer places',()=>{
  const plain=play('uniform',['S','B','A','C','G']),guided=play('astar',['S','A','C','G']);
  assert.equal(plain.distances.G,Math.min(...allPaths('S')));assert.equal(guided.distances.G,plain.distances.G);
  assert.deepEqual(guidedRoute(guided),['S','A','C','G']);assert.equal(plain.settled.length-1,4);assert.equal(guided.settled.length-1,3);
});
test('wrong priorities do not advance and valid partial trials restore',()=>{
  let state=play('astar',['S']);const wrong=advanceGuided(state,'B');assert.deepEqual(wrong.settled,['S']);
  const saved=restoreGuided({selected:'astar',actions:{uniform:['S','B'],astar:['S','A']}});assert.equal(saved.states.astar.distances.C,4);
  assert.throws(()=>restoreGuided({selected:'astar',actions:{uniform:[],astar:['S','B']}}),RangeError);
});
