import test from 'node:test';
import assert from 'node:assert/strict';
import {createSharing,sharingStep,sharingComplete,restoreSharing} from '../src/evaluation-sharing.js';
test('evaluation counts distinguish unused and repeated arguments',()=>{
 const s=createSharing(),expected={'value-ignore':1,'name-ignore':0,'need-ignore':0,'value-twice':1,'name-twice':2,'need-twice':1};
 for(const [id,count] of Object.entries(expected)){let t=s.trials[id];assert.equal(sharingStep(id,t,'return').finished,false);for(const action of ['start',...(id.endsWith('twice')?['use','use']:[]),'return'])t=sharingStep(id,t,action);assert.equal(t.calculations,count,id);assert.equal(t.finished,true);s.trials[id]=t;}s.answer='share';s.checked=true;assert.equal(sharingComplete(s),true);assert.deepEqual(restoreSharing(s),s);s.trials['name-ignore'].history.push('use');assert.throws(()=>restoreSharing(s));
});
