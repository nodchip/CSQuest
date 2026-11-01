import test from 'node:test';
import assert from 'node:assert/strict';
import {virtualCases,virtualWorks,virtualCaseCorrect,createVirtual,restoreVirtual,virtualComplete} from '../src/virtual-machines.js';
import {isolationResult} from '../src/vm-isolation.js';
test('containers share one host kernel while each VM has its own guest kernel in the model',()=>{
 const s=createVirtual();for(const [id,host,expected] of [['containersOld','v1',[true,false]],['containersNew','v2',[false,true]]]){const c=s.choices[id];c.host=host;assert.deepEqual(['old','new'].map(app=>virtualWorks(id,c,app)),expected);}const c=s.choices.machines;c.host='v2';c.guests={old:'v1',new:'v2'};assert.deepEqual(['old','new'].map(app=>virtualWorks('machines',c,app)),[true,true]);c.guests.old='v2';assert.equal(virtualWorks('machines',c,'old'),false);
});
test('all three trials require valid configurations and predictions; restoration validates copies',()=>{
 const s=createVirtual();for(const [id,item] of Object.entries(virtualCases)){const c=s.choices[id];c.host=item.host;if(item.kind==='vm')c.guests={old:'v1',new:'v2'};for(const app of ['old','new'])c.predictions[app]=virtualWorks(id,c,app)?'works':'fails';c.checked=true;assert.equal(virtualCaseCorrect(id,c),true);}assert.equal(virtualComplete(s),false);const old={...s};delete old.isolation;assert.deepEqual(restoreVirtual(old).isolation,s.isolation);for(const mode of ['shared','capped'])for(const load of ['idle','busy'])s.isolation.choices[mode][load]={a:isolationResult(mode,load).a,checked:true};s.isolation.answer='tradeoff';s.isolation.confirmed=true;assert.equal(virtualComplete(s),true);const copy=restoreVirtual(s);s.choices.machines.guests.old='v2';assert.equal(virtualComplete(s),false);assert.equal(copy.choices.machines.guests.old,'v1');copy.choices.machines.guests.old='bad';assert.throws(()=>restoreVirtual(copy),RangeError);
});
