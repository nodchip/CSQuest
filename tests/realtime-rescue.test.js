import test from 'node:test';
import assert from 'node:assert/strict';
import {rescueCreate,rescueAct,rescueComplete,rescueRestore} from '../src/realtime-rescue.js';

test('all scheduler and page configurations have independently calculated completion times',()=>{
 for(const [policy,pin,finish,steps] of [['preempt',true,3,'llh'],['cooperative',true,5,'llllh'],['preempt',false,6,'llllih'],['cooperative',false,8,'lllliiih']]){
  const s=rescueCreate();assert.ok(rescueAct(s,{type:'policy',value:policy}));assert.ok(rescueAct(s,{type:'pin',value:pin}));while(s.run.finished===null)assert.ok(rescueAct(s,{type:'tick'}));assert.equal(s.run.finished,finish);assert.equal(s.run.steps.map(v=>({low:'l',high:'h',idle:'i'}[v])).join(''),steps);assert.equal(s.succeeded,finish<=4);assert.equal(s.failed,finish>4);
 }
});
test('cooperative yielding permits an alternative success and saved history replays attempts',()=>{
 const s=rescueCreate();assert.equal(rescueAct(s,{type:'yield'}),false);while(s.run.finished===null)rescueAct(s,{type:'tick'});assert.ok(s.failed);assert.ok(rescueAct(s,{type:'restart'}));assert.ok(rescueAct(s,{type:'pin',value:true}));rescueAct(s,{type:'tick'});rescueAct(s,{type:'tick'});assert.ok(rescueAct(s,{type:'yield'}));assert.ok(rescueAct(s,{type:'tick'}));assert.equal(s.run.finished,3);assert.ok(s.succeeded);assert.equal(rescueComplete(s),false);s.answer='both';s.checked=true;assert.ok(rescueComplete(s));const restored=rescueRestore(s);assert.deepEqual(restored.run,s.run);restored.history.pop();assert.notEqual(restored.history.length,s.history.length);assert.throws(()=>rescueRestore({...s,history:[{type:'yield'}]}));
});
