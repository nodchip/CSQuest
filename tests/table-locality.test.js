import test from 'node:test';
import assert from 'node:assert/strict';
import {traversal,traversalSnapshot,traversalModes,createTraversalQuest,restoreTraversalQuest,traversalComplete} from '../src/table-locality.js';

test('each traversal reads all cells once and sums the same integer table',()=>{
 for(const id of Object.keys(traversalModes)){const path=traversal(id);assert.equal(path.length,16);assert.equal(new Set(path.map(p=>p.join(','))).size,16);assert.equal(traversalSnapshot(id,16).sum,136);}
});
test('row, column and tiled traversal show different page fault counts',()=>{
 assert.deepEqual(['rows','columns','tiles'].map(id=>traversalSnapshot(id,16).faults),[4,16,4]);
 for(const id of Object.keys(traversalModes))for(let i=0;i<=16;i++){
  const s=traversalSnapshot(id,i),last=new Map();let faults=0;
  for(let n=0;n<i;n++){const page=traversal(id)[n][0]+1;if(!last.has(page)){faults++;if(last.size===2){const victim=[...last].sort((a,b)=>a[1]-b[1])[0][0];last.delete(victim);}}last.set(page,n);}
  assert.equal(s.faults,faults);assert.deepEqual(s.order,[...last].sort((a,b)=>a[1]-b[1]).map(([page])=>page));
 }
});
test('restoration validates steps and completion requires all three and reflection',()=>{
 const s=createTraversalQuest();s.indices.rows=16;s.indices.columns=16;s.indices.tiles=15;s.answer='order';s.checked=true;assert.equal(traversalComplete(s),false);s.indices.tiles=16;assert.equal(traversalComplete(s),true);const restored=restoreTraversalQuest(s);restored.indices.rows=0;assert.equal(s.indices.rows,16);assert.throws(()=>restoreTraversalQuest({...s,indices:{...s.indices,rows:17}}));
});
