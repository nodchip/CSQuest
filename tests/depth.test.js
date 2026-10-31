import test from 'node:test';
import assert from 'node:assert/strict';
import {passages,createDepth,depthAction,restoreDepth} from '../src/depth.js';

test('DFS advances, backtracks from a dead end, and finds the goal without revisiting',()=>{
  const state=restoreDepth(['A','C','back','D','E','G']);
  assert.equal(state.status,'found');assert.deepEqual(state.stack,['S','A','D','E','G']);
  assert.deepEqual(state.visited,['S','A','C','D','E','G']);
  assert.equal(new Set(state.visited).size,state.visited.length);
  for(let i=1;i<state.stack.length;i++)assert.ok(passages[state.stack[i-1]].includes(state.stack[i]));
});
test('DFS route is not shortest: BFS finds the two-edge path',()=>{
  const queue=[['S']],seen=new Set(['S']);let shortest;
  while(queue.length){const path=queue.shift(),last=path.at(-1);if(last==='G'){shortest=path;break;}for(const room of passages[last])if(!seen.has(room)){seen.add(room);queue.push([...path,room]);}}
  assert.deepEqual(shortest,['S','B','G']);
  assert.ok(restoreDepth(['A','C','back','D','E','G']).stack.length>shortest.length);
  for(const [room,neighbors] of Object.entries(passages))for(const neighbor of neighbors)assert.ok(passages[neighbor].includes(room));
});
test('cannot backtrack early, skip ordering, revisit, or restore impossible actions',()=>{
  let s=createDepth();assert.equal(depthAction(s,'back').stack,s.stack);assert.equal(depthAction(s,'B').stack,s.stack);
  s=depthAction(s,'A');assert.equal(depthAction(s,'S').stack,s.stack);assert.equal(depthAction(s,'D').stack,s.stack);
  assert.throws(()=>restoreDepth(['A','D']),RangeError);assert.throws(()=>restoreDepth(['A','C','back','back']),RangeError);
  assert.throws(()=>restoreDepth(['G']),RangeError);
});
