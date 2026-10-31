import test from 'node:test';
import assert from 'node:assert/strict';
import {closureCases,createClosureTrial,closureMissing,stepClosure,createClosureSet,closureComplete,restoreClosureSet} from '../src/transitive-closure.js';

function independentReach(edges,start){const reached=new Set(),queue=edges.filter(([a])=>a===start).map(([,b])=>b);while(queue.length){const node=queue.shift();if(reached.has(node))continue;reached.add(node);for(const [a,b] of edges)if(a===node)queue.push(b);}return Array.from({length:4},(_,i)=>reached.has(i));}
test('each final table agrees with independent graph search including nonempty cycles',()=>{
  const all=createClosureSet();for(const [id,data] of Object.entries(closureCases)){let s=createClosureTrial(id);while(s.k<4){for(const [i,j] of closureMissing(s))s=stepClosure(s,`mark:${i}:${j}`);s=stepClosure(s,'next');}assert.deepEqual(s.matrix,Array.from({length:4},(_,i)=>independentReach(data.edges,i)));all.trials[id]=s;}assert.ok(closureComplete(all));assert.equal(all.trials.chain.matrix[0][0],false);assert.equal(all.trials.cycle.matrix[0][0],true);
});
test('marks require the current intermediate and saved stages replay',()=>{
  let s=createClosureTrial('cycle');assert.deepEqual(closureMissing(s),[[2,1]]);assert.equal(stepClosure(s,'next').history.length,0);assert.equal(stepClosure(s,'mark:0:2').history.length,0);s=stepClosure(s,'mark:2:1');s=stepClosure(s,'next');const histories={chain:[],cycle:s.history};assert.equal(restoreClosureSet({selected:'cycle',histories}).trials.cycle.k,1);assert.throws(()=>restoreClosureSet({selected:'cycle',histories:{...histories,cycle:['next']}}));
});
