import {test} from 'node:test';
import assert from 'node:assert/strict';
import {actorOrders,actorReplay,actorCreate,actorStep,actorComplete,actorRestore} from '../src/actor-mailbox.js';

test('each valid interleaving preserves A order and gives distinct replies',()=>{
 const cases={first:{out:['stock0','reject','deposit'],stock:1},middle:{out:['stock0','deposit','accept'],stock:0},early:{out:['deposit','stock1','accept'],stock:0}};
 for(const [id,{out,stock}] of Object.entries(cases)){const history=[];for(const m of actorOrders[id].sequence){assert.throws(()=>actorReplay(id,[...history,'arrive:bad']));history.push(`arrive:${m}`);assert.equal(actorReplay(id,history).stock,0);}for(const result of out){assert.throws(()=>actorReplay(id,[...history,'process:bad']));history.push(`process:${result}`);}const s=actorReplay(id,history);assert.equal(s.stock,stock);assert.deepEqual(s.responses.map(x=>x.result),out);assert.deepEqual(s.mailbox,[]);assert.equal(s.next,null);assert.throws(()=>actorReplay(id,[...history,'process:bad']));}
});
test('every case and reflection required; restored histories are checked',()=>{
 const q=actorCreate();for(const [id,results] of Object.entries({first:['stock0','reject','deposit'],middle:['stock0','deposit','accept'],early:['deposit','stock1','accept']})){q.order=id;for(const a of [...actorOrders[id].sequence.map(m=>`arrive:${m}`),...results.map(r=>`process:${r}`)]){actorStep(q,a);assert.deepEqual(actorRestore(q),q);}}assert(!actorComplete(q));q.answer='arrival';assert(actorComplete(q));const bad=structuredClone(q);bad.histories.first[0]='arrive:W';assert.throws(()=>actorRestore(bad));
});
