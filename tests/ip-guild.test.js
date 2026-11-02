import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {ipTypes,ipCases,ipCreate,ipCheck,ipInspect,ipComplete,ipRestore} from '../src/ip-guild.js';

test('each of the six cases checks all combinations including overlap and no selection',()=>{
 const types=Object.keys(ipTypes);
 for(const [scenario,c] of Object.entries(ipCases))for(let mask=0;mask<16;mask++){
  const selected=types.filter((_,i)=>mask&(1<<i));
  assert.equal(ipCheck(scenario,selected),selected.length===c.rights.length&&c.rights.every(k=>selected.includes(k)));
 }
 assert.equal(ipCheck('emblem',['trademark','copyright']),true);assert.equal(ipCheck('public',[]),true);
 assert.throws(()=>ipCheck('story',['copyright','copyright']));assert.throws(()=>ipCheck('story',['bad']));
});
test('incorrect selection does not advance; all cases and reflection required; draft is copied',()=>{
 const q=ipCreate();ipInspect(q);assert.deepEqual(q.completed,[]);
 for(const [scenario,c] of Object.entries(ipCases)){q.scenario=scenario;q.selected=[...c.rights];ipInspect(q);}
 assert.equal(ipComplete(q),false);q.reflection='independent';assert.equal(ipComplete(q),false);q.material='information';assert.equal(ipComplete(q),true);
 const copy=ipRestore(q);copy.completed.pop();assert.equal(q.completed.length,6);
 assert.throws(()=>ipRestore({...q,last:{...q.last,correct:false}}));
});
