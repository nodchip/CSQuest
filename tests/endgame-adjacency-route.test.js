import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {replayAdjacencyRoute} from '../src/endgame-adjacency-route.js';
const edges=['toggle:0:1','toggle:0:2','toggle:1:2','toggle:2:3','toggle:3:0'];
test('各地点の直接の行き先を一覧にする',()=>{const h=['toggle:0:1','toggle:0:2','check','toggle:1:2','check','toggle:2:3','check','toggle:3:0','check'],p=replayAdjacencyRoute('list',h);assert.equal(p.done,true);assert.deepEqual(p.state.list,[[false,true,true,false],[false,false,true,false],[false,false,false,true],[true,false,false,false]]);});
test('行が出発・列が到着の行列で５本の片道を記す',()=>{assert.equal(replayAdjacencyRoute('matrix',[...edges.slice(0,4),'check']),null);const p=replayAdjacencyRoute('matrix',[...edges,'check']);assert.equal(p.done,true);assert.deepEqual(p.state.matrix,[[false,true,true,false],[false,false,true,false],[false,false,false,true],[true,false,false,false]]);});
test('直接の道と経由して行ける道を区別する',()=>{const h=['answer:yes','answer:no','answer:yes'],p=replayAdjacencyRoute('compare',JSON.parse(JSON.stringify(h)));assert.deepEqual(p.answers,[true,false,true]);assert.equal(p.done,true);assert.equal(replayAdjacencyRoute('compare',['answer:yes','answer:yes']),null);assert.equal(replayAdjacencyRoute('compare',[...h,'reset']),null);});
test('途中再開、方向・不完全な一覧・リセットを検証',()=>{assert.equal(replayAdjacencyRoute('list',['toggle:1:2']),null);assert.equal(replayAdjacencyRoute('list',['toggle:0:1','check']),null);const p=replayAdjacencyRoute('list',['toggle:0:1','reset']);assert.equal(p.state.list[0][1],false);assert.equal(replayAdjacencyRoute('matrix',{}),null);});
