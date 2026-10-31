import test from 'node:test';
import assert from 'node:assert/strict';
import {createStreams,streamStep,streamDone,streamComplete,restoreStreams} from '../src/lazy-stream.js';
test('finite eager and delayed strategies produce the same prefix with different work',()=>{
 let eager=streamStep('finiteEager',createStreams().trials.finiteEager,'take');assert.equal(eager.taken,0);for(const a of ['prepare','take','take'])eager=streamStep('finiteEager',eager,a);let lazy=createStreams().trials.finiteLazy;for(const a of ['take','take'])lazy=streamStep('finiteLazy',lazy,a);assert.deepEqual([eager.generated,eager.taken,lazy.generated,lazy.taken],[4,2,2,2]);
});
test('whole infinite preparation never finishes while three delayed demands do',()=>{
 const s=createStreams();for(const id of Object.keys(s.trials)){const actions={finiteEager:['prepare','take','take'],finiteLazy:['take','take'],infiniteEager:['prepare'],infiniteLazy:['take','take','take']}[id];for(const a of actions)s.trials[id]=streamStep(id,s.trials[id],a);assert.equal(streamDone(id,s.trials[id]),true);}assert.equal(s.trials.infiniteEager.stuck,true);assert.equal(s.trials.infiniteLazy.generated,3);s.answer='prefix';s.checked=true;assert.equal(streamComplete(s),true);assert.deepEqual(restoreStreams(s),s);s.trials.infiniteEager.history.push('take');assert.throws(()=>restoreStreams(s));
});
