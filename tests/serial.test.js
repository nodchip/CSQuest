import test from 'node:test';
import assert from 'node:assert/strict';
import {serialRun,serialGoal,restoreSerial,serialComplete,createTwoPhaseLocks,stepTwoPhaseLocks,restoreTwoPhaseLocks,twoPhaseLocksComplete} from '../src/serial.js';

test('shared updates show the conflict directions for every possible interleaving',()=>{
  for(const seq of ['AABB','ABAB','ABBA','BAAB','BABA','BBAA']){
    const run=serialRun('shared',[...seq]);
    assert.equal(run.classification,seq==='AABB'?'a':seq==='BBAA'?'b':'neither');
    assert.equal(run.values.X,seq==='AABB'||seq==='BBAA'?2:1);
  }
});
test('independent ledgers have no conflicting edges even when operations interleave',()=>{
  for(const seq of ['AABB','ABAB','ABBA','BAAB','BABA','BBAA']){
    const run=serialRun('separate',[...seq]);assert.deepEqual(run.edges,[]);assert.equal(run.classification,'either');assert.deepEqual(run.values,{X:1,Y:1});
  }
  assert.equal(serialGoal('separate',[...'ABAB']),'independent');assert.equal(serialGoal('separate',[...'AABB']),null);
});
test('restoration accepts actual witnesses and rejects illegal histories',()=>{
  const saved={mode:'shared',history:['A'],witnesses:{ordered:{mode:'shared',history:[...'AABB']},conflict:{mode:'shared',history:[...'ABAB']},independent:{mode:'separate',history:[...'ABBA']}}};
  assert.equal(serialComplete(restoreSerial(saved)),false);
  saved.lockHistory=['take:X','take:Y','release:X','take:Z','release:Y'];assert.equal(serialComplete(restoreSerial(saved)),true);
  assert.throws(()=>serialRun('shared',[...'AAA']),RangeError);
  assert.throws(()=>restoreSerial({...saved,witnesses:{...saved.witnesses,conflict:{mode:'shared',history:[...'AABB']}}}),RangeError);
});

test('two-phase locks refuse acquisition after the first release and preserve valid history',()=>{
 let s=createTwoPhaseLocks();for(const a of ['take:X','take:Y','release:X'])s=stepTwoPhaseLocks(s,a);
 assert.equal(s.shrinking,true);assert.deepEqual(s.held,['Y']);
 s=stepTwoPhaseLocks(s,'take:Z');assert.equal(s.denied,true);assert.deepEqual(s.held,['Y']);assert.equal(twoPhaseLocksComplete(s),false);
 s=stepTwoPhaseLocks(s,'release:Y');assert.equal(twoPhaseLocksComplete(s),true);
 assert.deepEqual(restoreTwoPhaseLocks(s.history),s);
 assert.throws(()=>restoreTwoPhaseLocks(['release:X']));assert.throws(()=>restoreTwoPhaseLocks(['take:Q']));
 const invalid=stepTwoPhaseLocks(s,'take:X');assert.deepEqual(invalid.history,s.history);
});
