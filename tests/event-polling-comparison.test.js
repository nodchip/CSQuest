import test from 'node:test';
import assert from 'node:assert/strict';
import {createEventComparison,eventComparisonState,restoreEventComparison} from '../src/event-polling-comparison.js';
import {eventWorldCreate,eventWorldRestore} from '../src/event-worlds.js';

test('fixed poll times miss a brief signal but see a held signal; recorded events are processed later',()=>{
 for(const mode of ['poll','event'])for(const signal of ['pulse','held']){
  const rows=[0,1,2,3].map(n=>eventComparisonState(mode,signal,n));
  assert.equal(rows[1].high,false);assert.equal(rows[2].high,true);assert.equal(rows[3].high,signal==='held');
  assert.equal(rows[2].queued,mode==='event');assert.equal(rows[3].queued,false);
  assert.equal(rows[3].observed,mode==='event'||signal==='held');assert.equal(rows[3].checks,mode==='poll'?2:0);
 }
});
test('comparison restores independently and old event-world drafts migrate',()=>{
 const q=eventWorldCreate();delete q.comparison;assert.deepEqual(eventWorldRestore(q).comparison,createEventComparison());
 const c=createEventComparison();c.steps['event:pulse']=2;c.answer='assumptions';const r=restoreEventComparison(c);r.steps['event:pulse']=3;assert.equal(c.steps['event:pulse'],2);
 c.steps['poll:held']=4;assert.throws(()=>restoreEventComparison(c));
});
