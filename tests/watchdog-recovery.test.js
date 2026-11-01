import test from 'node:test';
import assert from 'node:assert/strict';
import {watchdogCases,watchdogTrial,watchdogStep,watchdogFinished,watchdogCreate,watchdogRestore,watchdogComplete} from '../src/watchdog-recovery.js';

test('watchdog detects lost progress but a short timeout also resets a slow healthy worker',()=>{
 const expected={normal:[6,false,'open',3],stalled3:[3,true,'closed',0],stalled5:[5,true,'closed',0],slow3:[3,true,'closed',0],slow5:[6,false,'open',1],blind:[6,false,'open',0]};
 for(const id of Object.keys(watchdogCases)){const t=watchdogTrial();while(watchdogStep(id,t)){}assert.deepEqual([t.time,t.reset,t.output,t.progress],expected[id]);assert.ok(watchdogFinished(t));}
});
test('every scenario and reflection are required and saved ticks cannot pass a reset',()=>{
 const s=watchdogCreate();for(const id of Object.keys(watchdogCases))while(watchdogStep(id,s.trials[id])){}assert.equal(watchdogComplete(s),false);s.answer='tradeoff';s.checked=true;assert.ok(watchdogComplete(s));const copy=watchdogRestore(s);copy.trials.normal.history.pop();assert.equal(s.trials.normal.history.length,6);assert.throws(()=>watchdogRestore({...s,trials:{...s.trials,stalled3:{history:['tick','tick','tick','tick']}}}));
});
