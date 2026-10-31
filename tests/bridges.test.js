import test from 'node:test';
import assert from 'node:assert/strict';
import {villages,bridgeScenarios,createBridges,components,formsCycle,selectBridge,decideBridge,bridgeCost,restoreBridges} from '../src/bridges.js';
function play(id){let s=createBridges(id);while(s.status==='playing'){const edge=bridgeScenarios[id].edges.find(e=>!s.processed.includes(e.id));s=selectBridge(s,edge.id);s=decideBridge(s,formsCycle(s,edge)?'skip':'take');}return s;}
function bruteMinimum(edges){let best=Infinity;for(let mask=0;mask<1<<edges.length;mask++){const picked=edges.filter((_,i)=>mask&(1<<i));if(picked.length!==villages.length-1)continue;const parent=Object.fromEntries(villages.map(v=>[v,v]));const root=x=>{while(parent[x]!==x)x=parent[x];return x;};let acyclic=true;for(const e of picked){const a=root(e.a),b=root(e.b);if(a===b){acyclic=false;break;}parent[a]=b;}if(acyclic&&new Set(villages.map(root)).size===1)best=Math.min(best,picked.reduce((sum,e)=>sum+e.cost,0));}return best;}
test('both constructed trees are connected and agree with independent enumeration of all candidates',()=>{
  for(const id of Object.keys(bridgeScenarios)){const result=play(id);assert.equal(components(result).length,1);assert.equal(result.chosen.length,4);assert.equal(bridgeCost(result),bruteMinimum(bridgeScenarios[id].edges));}
  assert.equal(bridgeCost(play('river')),13);assert.equal(bridgeCost(play('valley')),12);
});
test('a more expensive edge and an incorrect cycle decision do not advance',()=>{
  let s=createBridges('river');assert.equal(selectBridge(s,'BC').candidate,null);s=selectBridge(s,'AB');assert.equal(decideBridge(s,'skip').processed.length,0);s=decideBridge(s,'take');s=decideBridge(selectBridge(s,'BC'),'take');s=selectBridge(s,'AC');assert.equal(formsCycle(s,bridgeScenarios.river.edges[2]),true);assert.equal(decideBridge(s,'take').processed.length,2);
});
test('partial independent work restores only valid choices',()=>{
  const saved={selected:'river',actions:{river:['edge:AB','take','edge:BC'],valley:['edge:AE','take']}};const s=restoreBridges(saved);assert.equal(s.states.river.candidate,'BC');assert.equal(bridgeCost(s.states.valley),1);
  assert.throws(()=>restoreBridges({...saved,actions:{...saved.actions,river:['edge:AB','skip']}}),RangeError);
});
