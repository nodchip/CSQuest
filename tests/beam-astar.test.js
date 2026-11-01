import {test} from 'node:test';
import assert from 'node:assert/strict';
import {beamTree} from '../src/beam-tree.js';
import {createBeamAstar,beamAstarAct,beamAstarPath,restoreBeamAstar} from '../src/beam-astar.js';
test('A* preserves the pruned branch and selects lowest g+h with deterministic ties',()=>{
 let s=createBeamAstar();for(const id of ['S','A'])s=beamAstarAct(s,id).state;assert.equal(beamAstarAct(s,'C').ok,false);assert.ok(s.open.some(n=>n.id==='B'));for(const id of ['B','C','X','E','G']){const r=beamAstarAct(s,id);assert.equal(r.ok,true);s=r.state;}assert.deepEqual(s.expanded,['S','A','B','C','X','E']);assert.deepEqual(beamAstarPath(s),['S','B','E','G']);assert.equal(s.history.length,7);assert.equal(beamAstarAct(s,'D').ok,false);
 const h=beamTree.B.find(([id])=>id==='E')[1];assert.ok(h>1);assert.deepEqual(restoreBeamAstar(s),s);assert.throws(()=>restoreBeamAstar({history:['S','B']}),RangeError);
});
