import test from 'node:test';
import assert from 'node:assert/strict';
import {keyMazes,createKeyMaze,keyMazeStep,createKeySearch,expandKeySearch,keySearchPath,createKeyMazeSet,restoreKeyMaze,keyMazeComplete} from '../src/key-maze.js';
import {createDynamicPath,dynamicPathAct} from '../src/dynamic-path.js';

// Independent enumeration uses room and key as distinct search-state fields.
function minimum(id){const edges=keyMazes[id].edges,queue=[{room:'S',key:false,distance:0}],seen=new Set(['S:false']);while(queue.length){const s=queue.shift();if(s.room==='G')return s.distance;for(const [a,b] of edges){const next=a===s.room?b:b===s.room?a:null;if(!next||(next==='G'&&!s.key))continue;const key=s.key||next==='K',tag=`${next}:${key}`;if(!seen.has(tag)){seen.add(tag);queue.push({room:next,key,distance:s.distance+1});}}}return Infinity;}
test('both maps have a feasible route and the limit equals the shortest route',()=>{
  assert.equal(minimum('bridge'),3);assert.equal(minimum('return'),4);
  for(const [id,path] of [['bridge',['K','A','G']],['return',['K','S','A','G']]]){let s=createKeyMaze(id);for(const room of path)s=keyMazeStep(s,room);assert.equal(s.status,'found');assert.equal(s.remaining,0);assert.equal(path.length,minimum(id));}
});
test('the key changes available progress at the same room',()=>{
  let s=createKeyMaze('return');s=keyMazeStep(s,'A');const denied=keyMazeStep(s,'G');assert.equal(denied.place,'A');assert.equal(denied.key,false);assert.deepEqual(denied.history,s.history);
  s=createKeyMaze('return');s=keyMazeStep(s,'K');s=keyMazeStep(s,'S');assert.equal(s.place,'S');assert.equal(s.key,true);s=keyMazeStep(s,'A');s=keyMazeStep(s,'G');assert.equal(s.status,'found');
  let failed=createKeyMaze('bridge');for(const room of ['A','S','A'])failed=keyMazeStep(failed,room);assert.equal(failed.status,'failed');assert.throws(()=>keyMazeStep(failed,'G'),RangeError);
});
test('histories replay only valid transitions and completion requires both maps',()=>{
  const saved={selected:'bridge',history:{bridge:['K','A','G'],return:['K','S','A','G']}};assert.equal(keyMazeComplete(restoreKeyMaze(saved)),false);assert.equal(keyMazeComplete(createKeyMazeSet()),false);
  const partial=restoreKeyMaze({...saved,searchHistory:['S0','A0','K1','S1','A1','G1'],searchAnswer:'state',searchChecked:true});assert.equal(keyMazeComplete(partial),false);let dynamic=createDynamicPath();for(const action of ['move:A','move:G','move:B','move:G','answer:replan','check'])dynamic=dynamicPathAct(dynamic,action).state;const complete=restoreKeyMaze({...saved,searchHistory:['S0','A0','K1','S1','A1','G1'],searchAnswer:'state',searchChecked:true,dynamic});assert.equal(keyMazeComplete(complete),true);
  assert.throws(()=>restoreKeyMaze({...saved,history:{...saved.history,return:['A','G']}}),RangeError);
  assert.throws(()=>restoreKeyMaze({...saved,history:{...saved.history,bridge:['G']}}),RangeError);
});
test('on-demand state generation preserves key-dependent identity and shortest path',()=>{
 let s=createKeySearch();assert.equal(expandKeySearch(s,'A0').ok,false);while(!s.done){const r=expandKeySearch(s,s.queue[0]);assert.equal(r.ok,true);s=r.state;}
 assert.deepEqual(s.history,['S0','A0','K1','S1','A1','G1']);assert.deepEqual(keySearchPath(s),['S0','K1','S1','A1','G1']);assert.equal(s.nodes.G1.distance,minimum('return'));assert.equal(s.nodes.S0.key,false);assert.equal(s.nodes.S1.key,true);assert.ok(s.edges.includes('A1>G1'));assert.equal(s.edges.includes('A0>G0'),false);assert.equal(expandKeySearch(s,'G1').ok,false);
 const partial=restoreKeyMaze({selected:'return',history:{bridge:[],return:[]},searchHistory:['S0','A0','K1'],searchAnswer:'state',searchChecked:false});assert.equal(partial.search.nodes.S1.distance,2);assert.throws(()=>restoreKeyMaze({selected:'return',history:{bridge:[],return:[]},searchHistory:['S0','K1']}));
});
