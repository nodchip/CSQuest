import {test} from 'node:test';
import assert from 'node:assert/strict';
import {replayRun,createReplay,replayComplete,restoreReplay} from '../src/replay-sequence.js';
test('authenticated sequence prevents number forgery, replay, and early delivery without advancing state',()=>{
 const bound=replayRun('bound',['two','one','forged','one','two']);assert.deepEqual(bound.events.map(e=>e.result),['early','accepted','invalid','old','accepted']);assert.deepEqual([bound.next,bound.stock],[3,2]);
 const weak=replayRun('unbound',['one','forged','two']);assert.deepEqual(weak.events.map(e=>e.result),['accepted','accepted','old']);assert.deepEqual([weak.next,weak.stock],[3,2]);
});
test('completion requires the compared failure and protected recovery; restore replays valid histories',()=>{
 const s=createReplay();s.histories.unbound=['one','forged'];s.histories.bound=['one','forged','one','two'];const copy=restoreReplay(s);assert.equal(replayComplete(copy),true);s.histories.bound.pop();assert.equal(replayComplete(s),false);assert.throws(()=>restoreReplay({...s,histories:{unbound:['other'],bound:[]}}),RangeError);
});
