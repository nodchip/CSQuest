import test from 'node:test';
import assert from 'node:assert/strict';
import {adjacencyCases,createAdjacencyTrial,toggleAdjacency,checkAdjacency,runAdjacencyQuery,adjacencyQuery,adjacencyCorrect,createAdjacencySet,adjacencyComplete,restoreAdjacencySet} from '../src/adjacency.js';

test('both directed representations agree with the graph and query its direct edges',()=>{
  const all=createAdjacencySet();for(const [id,data] of Object.entries(adjacencyCases)){let s=createAdjacencyTrial(id);for(const form of ['matrix','list']){for(const [i,j] of data.edges)s=toggleAdjacency(s,form,i,j);s=checkAdjacency(s,form);}for(const form of ['matrix','list'])s=runAdjacencyQuery(s,form);assert.equal(adjacencyQuery(s,'matrix').found,id==='roads');assert.equal(adjacencyQuery(s,'matrix').examined,1);assert.equal(adjacencyQuery(s,'list').examined,2);assert.ok(adjacencyCorrect(s));all.trials[id]=s;}assert.ok(adjacencyComplete(all));assert.ok(adjacencyComplete(restoreAdjacencySet(all)));
});
test('direction, self-loops, incomplete representations and invalid saved queries are checked',()=>{
  let s=createAdjacencyTrial('loop');s=toggleAdjacency(s,'matrix',0,0);s=checkAdjacency(s,'matrix');assert.equal(runAdjacencyQuery(s,'matrix').queried.matrix,false);const all=createAdjacencySet();all.trials.loop={...s,queried:{matrix:true,list:false}};assert.throws(()=>restoreAdjacencySet(all));
  let wrong=createAdjacencyTrial('roads');for(const [i,j] of adjacencyCases.roads.edges)wrong=toggleAdjacency(wrong,'matrix',j,i);wrong=checkAdjacency(wrong,'matrix');assert.equal(adjacencyCorrect(wrong),false);
});
