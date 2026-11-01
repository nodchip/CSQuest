import test from 'node:test';
import assert from 'node:assert/strict';
import {guidedRoads} from '../src/astar.js';
import {idaEstimate,idaTrace,advanceIda} from '../src/ida-star.js';

test('IDA* raises its bound to the minimum pruned value and finds an optimal path',()=>{
 assert.deepEqual([...new Set(idaTrace.map(x=>x.threshold))],[3,4,5,6]);
 let minExceeded=Infinity;
 for(let i=0;i<idaTrace.length-1;i++){
  const before=idaTrace[i],after=idaTrace[i+1],item=before.stack.at(-1),f=item.cost+idaEstimate[item.place];
  assert.equal(item.cost,item.path.slice(1).reduce((sum,place,index)=>sum+guidedRoads[item.path[index]][place],0));
  if(f>before.threshold)minExceeded=Math.min(minExceeded,f);
  if(after.threshold!==before.threshold){assert.equal(after.threshold,minExceeded);minExceeded=Infinity;}
 }
 const final=idaTrace.at(-1);assert.equal(final.done,true);assert.match(final.message,/S→A→C→G.*費用 6/);
 const cost=(place)=>place==='G'?0:Math.min(...Object.entries(guidedRoads[place]).map(([next,edge])=>edge+cost(next)));
 assert.equal(cost('S'),6);for(const place of Object.keys(guidedRoads))assert.ok(idaEstimate[place]<=cost(place));
});
test('only the last frontier entry advances and a finished search cannot advance',()=>{assert.equal(advanceIda(0,0),1);assert.ok(idaTrace[1].stack.length>1);assert.equal(advanceIda(1,0),1);assert.equal(advanceIda(1,idaTrace[1].stack.length-1),2);assert.throws(()=>advanceIda(idaTrace.length-1,0),RangeError);assert.throws(()=>advanceIda(0,-1),RangeError);});
