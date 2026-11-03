import test from 'node:test';
import assert from 'node:assert/strict';
import {dsmCases,dsmReplay,dsmStep,dsmDone,dsmCreate,dsmComplete,dsmRestore} from '../src/dsm-cache.js';
const plans={delayed:['write','read','invalidate','read'],synchronous:['start','read','invalidate','finish','read'],rdma:['write','read','invalidate','read']};
test('遅延と遠隔書込みでは完了後の古い写しを観察する',()=>{for(const id of ['delayed','rdma']){const state=dsmReplay(id,plans[id]);assert.deepEqual(state.reads,[{value:0,afterCompletion:true},{value:1,afterCompletion:true}]);assert.equal(state.home,1);}});
test('無効化を待つ例では完了前の旧値と完了後の新値を区別する',()=>{const state=dsmReplay('synchronous',plans.synchronous);assert.deepEqual(state.reads,[{value:0,afterCompletion:false},{value:1,afterCompletion:true}]);assert.equal(state.cache,1);});
test('無効な順序を拒み途中状態と振り返りを保存する',()=>{const s=dsmCreate();assert.equal(dsmStep('synchronous',[],'finish').ok,false);for(const id of Object.keys(dsmCases)){let history=[];for(const action of plans[id]){const result=dsmStep(id,history,action);assert.equal(result.ok,true);history=result.history;}assert.equal(dsmDone(id,history),true);s.trials[id]=history;}assert.equal(dsmComplete(s),false);s.reflection='ordering';assert.equal(dsmComplete(dsmRestore(s)),true);s.trials.rdma=['read'];assert.throws(()=>dsmRestore(s));});
