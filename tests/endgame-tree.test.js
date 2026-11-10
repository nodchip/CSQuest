import test from 'node:test';
import assert from 'node:assert/strict';
import {replayTree} from '../src/endgame-tree.js';

test('search follows the ordering and ends at an empty branch for a missing key',()=>{
 const h=['visit:4','visit:2','visit:3','next','visit:4','visit:6','visit:7','empty','next'];const p=replayTree('search',h);
 assert.equal(p.done,true);assert.deepEqual(p.results.map(x=>[x.path,x.found]),[[[4,2,3],true],[[4,6,7],false]]);
 assert.equal(replayTree('search',['visit:4','visit:6']),null);
});
test('insertion builds a tree with descendants in their ordered subtrees',()=>{
 const h=['insert','next','visit:4','insert','next','visit:4','insert','next','visit:4','visit:2','insert','next'];const p=replayTree('insert',h);
 assert.equal(p.done,true);assert.deepEqual(p.nodes,{root:4,items:{4:{left:2,right:6},2:{left:null,right:3},6:{left:null,right:null},3:{left:null,right:null}}});
 assert.equal(replayTree('insert',['visit:4']),null);
});
test('the same keys yield different comparison paths in balanced and chain shapes',()=>{
 const h=['visit:4','visit:6','visit:7','next',...Array.from({length:7},(_,i)=>`visit:${i+1}`),'next','visit:4','visit:6','visit:7','empty','next',...Array.from({length:7},(_,i)=>`visit:${i+1}`),'empty','next'];const p=replayTree('compare',h);
 assert.equal(p.done,true);assert.deepEqual(p.results.map(x=>[x.path.length,x.found]),[[3,true],[7,true],[3,false],[7,false]]);
});
