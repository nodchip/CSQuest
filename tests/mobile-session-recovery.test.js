import test from 'node:test';
import assert from 'node:assert/strict';
import {recoveryCreate,recoveryResult,recoveryStep,recoveryDone,recoveryRestore} from '../src/mobile-session-recovery.js';
import {mobileCompareCreate,mobileCompareRestore} from '../src/mobile-general-compare.js';

test('both devices lose process memory and only successful saved data restores',()=>{
 const q=recoveryCreate();for(const device of ['mobile','desktop'])for(const mode of ['memory','saved']){q.device=device;q.mode=mode;recoveryStep(q);assert.equal(recoveryResult(mode,1).inMemory,true);recoveryStep(q);assert.equal(recoveryResult(mode,2).inMemory,false);recoveryStep(q);const r=recoveryResult(mode,3);assert.equal(r.recovered,mode==='saved');assert.equal(r.inMemory,mode==='saved');assert.throws(()=>recoveryStep(q));}assert(!recoveryDone(q));q.reflection='both';assert(recoveryDone(q));
});
test('partial states restore independently and previous comparison drafts migrate',()=>{
 const q=recoveryCreate();recoveryStep(q);const copy=recoveryRestore(q);copy.phases.mobile.memory=3;assert.equal(q.phases.mobile.memory,1);assert.throws(()=>recoveryRestore({...q,phases:{mobile:{memory:4,saved:0},desktop:{memory:0,saved:0}}}));const {recovery,...old}=mobileCompareCreate();assert.deepEqual(mobileCompareRestore(old),mobileCompareCreate());
});
