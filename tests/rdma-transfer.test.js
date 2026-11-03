import test from 'node:test';
import assert from 'node:assert/strict';
import {rdmaCases,rdmaActions,rdmaAllowed,rdmaReplay,rdmaStep,rdmaDone,rdmaCreate,rdmaComplete,rdmaRestore} from '../src/rdma-transfer.js';

const plans={message:['post','transfer','process','inspect'],write:['post','transfer','inspect','notify','process'],key:['post','transfer','inspect'],range:['post','transfer','inspect'],permission:['post','transfer','inspect']};
test('valid write, three rejected requests and the message path have distinct effects',()=>{
 for(const [id,actions] of Object.entries(plans)){let history=[];for(const action of actions){for(const wrong of Object.keys(rdmaActions).filter(x=>x!==action))assert.equal(rdmaStep(id,history,wrong).ok,false);const next=rdmaStep(id,history,action);assert.equal(next.ok,true);history=next.history;}const s=rdmaReplay(id,history);assert.equal(rdmaDone(id,history),true);assert.deepEqual(s.remote,id==='message'||id==='write'?[0,7,8,0]:[0,0,0,0]);assert.equal(s.success,id==='message'||id==='write');}
 const sent=rdmaReplay('message',['post','transfer']);assert.equal(sent.mailbox,true);assert.deepEqual(sent.remote,[0,0,0,0]);const written=rdmaReplay('write',['post','transfer','inspect']);assert.deepEqual(written.remote,[0,7,8,0]);assert.equal(written.notice,false);assert.equal(written.consumed,false);
 assert.equal(rdmaAllowed(rdmaCases.write),true);for(const id of ['key','range','permission'])assert.equal(rdmaAllowed(rdmaCases[id]),false);
});
test('all five histories and reflection are required and restored histories are validated',()=>{
 const s=rdmaCreate();for(const [id,actions] of Object.entries(plans))s.trials[id]=[...actions];assert.equal(rdmaComplete(s),false);s.reflection='distinguish';assert.equal(rdmaComplete(s),true);const copy=rdmaRestore(s);copy.trials.write.pop();assert.equal(rdmaComplete(copy),false);assert.equal(rdmaComplete(s),true);copy.trials.key=['transfer'];assert.throws(()=>rdmaRestore(copy));
});
