import test from 'node:test';
import assert from 'node:assert/strict';
import {keyLifecycleChoices,evaluateKeyLifecycle,createKeyLifecycle,keyLifecycleComplete,restoreKeyLifecycle} from '../src/key-lifecycle.js';
test('all 32 policies keep past compromise, future response and remaining local copies distinct',()=>{
 let cases=0;
 for(const generation of keyLifecycleChoices.generation)for(const delivery of keyLifecycleChoices.delivery)for(const storage of keyLifecycleChoices.storage)for(const response of keyLifecycleChoices.response)for(const disposal of keyLifecycleChoices.disposal){
  const policy={generation,delivery,storage,response,disposal},r=evaluateKeyLifecycle(policy);cases++;
  assert.equal(r.before,generation==='known'||delivery==='public'||storage==='open');
  assert.equal(r.oldAfter,true);assert.equal(r.newAfter,response==='reuse');
  assert.equal(r.localOldCopies,disposal==='both'?0:1);assert.equal(r.stolenCopyRemains,true);
 }
 assert.equal(cases,32);assert.throws(()=>evaluateKeyLifecycle({}));
});
test('isolated failure causes and complete restored progress are checked',()=>{
 const s=createKeyLifecycle();assert.deepEqual(evaluateKeyLifecycle(s.policy).causes,[]);
 for(const [field,value,expected] of [['generation','known','known'],['delivery','public','public'],['storage','open','open']])assert.deepEqual(evaluateKeyLifecycle({...s.policy,[field]:value}).causes,[expected]);
 s.observed=['protected','known','public','open','rotate','reuse','both','primary'];s.answer='lifecycle';s.checked=true;assert.ok(keyLifecycleComplete(restoreKeyLifecycle(s)));
 assert.throws(()=>restoreKeyLifecycle({...s,observed:['open','open']}));assert.throws(()=>restoreKeyLifecycle({...s,policy:{...s.policy,storage:'unknown'}}));
});
