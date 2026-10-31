import {test} from 'node:test';
import assert from 'node:assert/strict';
import {terrainCases,terrainMoves,terrainStable,createTerrainTrial,terrainStep,restoreTerrain} from '../src/terrain-relaxation.js';

test('every allowed transfer conserves material and reduces squared height until stable',()=>{
 for(const id of Object.keys(terrainCases)){const stack=[createTerrainTrial(id)],seen=new Set();let finished=0;while(stack.length){const s=stack.pop(),key=s.heights.join(',');if(seen.has(key))continue;seen.add(key);assert.equal(s.heights.reduce((a,b)=>a+b),4);assert.ok(s.heights.every(n=>n>=0));
  const before=s.heights.reduce((a,b)=>a+b*b,0),valid=[];for(const action of Object.keys(terrainMoves)){const n=terrainStep(s,action);if(n.history.length>s.history.length){valid.push(n);assert.ok(n.heights.reduce((a,b)=>a+b*b,0)<before);stack.push(n);}}
  assert.equal(valid.length===0,terrainStable(s.heights));if(!valid.length){finished++;assert.equal(terrainStep(s,'finish').done,true);}}
  assert.ok(finished>0);
 }
});
test('restoration rejects impossible or premature transfers and replays valid histories',()=>{
 const s=restoreTerrain({selected:'hill',histories:{hill:['ba'],slope:[]}});assert.deepEqual(s.trials.hill.heights,[1,3,0]);
 assert.throws(()=>restoreTerrain({selected:'hill',histories:{hill:['ab'],slope:[]}}),RangeError);assert.throws(()=>restoreTerrain({selected:'hill',histories:{hill:['finish'],slope:[]}}),RangeError);
});
