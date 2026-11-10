import test from 'node:test';
import assert from 'node:assert/strict';
import {replayDepth} from '../src/endgame-depth.js';
const nearFirst=['draw:near','draw:far','check'],farFirst=['draw:far','draw:near','check'];
test('without a depth test, the last fragment covers the earlier one',()=>{
 const result=replayDepth('painter',[...nearFirst,...farFirst]);assert.equal(result.done,true);assert.deepEqual(result.results.map(r=>r[0].name),['赤の灯り','青の灯り']);
 assert.equal(replayDepth('painter',['draw:far']),null);assert.equal(replayDepth('painter',['draw:near','draw:near']),null);
});
test('strictly nearer depth keeps both colour and depth against a farther fragment',()=>{
 const partial=['draw:near'];const restored=replayDepth('buffer',JSON.parse(JSON.stringify(partial)));assert.deepEqual(restored.pixels[0],{id:'near',name:'青の灯り',depth:2});
 assert.deepEqual(replayDepth('buffer',[...partial,'draw:far']).pixels[0],{id:'near',name:'青の灯り',depth:2});
 assert.deepEqual(replayDepth('buffer',[...partial,'reset']).pixels,[null,null]);
 const result=replayDepth('buffer',[...nearFirst,...farFirst]);assert.equal(result.done,true);assert.deepEqual(result.results.map(r=>r[0].depth),[2,2]);assert.deepEqual(result.results.map(r=>r[0].name),['青の灯り','青の灯り']);
});
test('equal depth retains the first, and depths are compared independently per pixel',()=>{
 const h=['draw:blue','draw:red','check','draw:red','draw:blue','check','draw:blue','draw:red','draw:gold','check'];const result=replayDepth('equal',h);
 assert.equal(result.done,true);assert.equal(result.results[0][0].name,'青の灯り');assert.equal(result.results[1][0].name,'赤の灯り');assert.deepEqual(result.results[2].map(x=>[x.name,x.depth]),[['金の灯り',2],['赤の灯り',3]]);assert.equal(replayDepth('equal',[...h,'check']),null);
});
