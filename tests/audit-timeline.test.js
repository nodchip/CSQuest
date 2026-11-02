import {test} from 'node:test';
import assert from 'node:assert/strict';
import {auditTimelineCases,auditTimelineOrder,auditTimelineCreate,auditTimelineReplay,auditTimelineAdd,auditTimelineCheck,auditTimelineComplete,auditTimelineRestore} from '../src/audit-timeline.js';

test('only the three logged timestamps in order form a valid timeline',()=>{
 const events=['login','read','denied'];for(const a of events)for(const b of events)for(const c of events){const h=[a,b,c];if(h.join()===auditTimelineOrder.join())assert.equal(auditTimelineReplay(h).next,null);else assert.throws(()=>auditTimelineReplay(h));}
 assert.equal(auditTimelineReplay(['login']).next,'read');assert.throws(()=>auditTimelineReplay([...auditTimelineOrder,'read']));
});
test('both timelines and their different recorded outcomes plus limited inference are required',()=>{
 const q=auditTimelineCreate();for(const [id,c] of Object.entries(auditTimelineCases)){q.selected=id;assert.equal(auditTimelineCheck(q),false);for(const event of auditTimelineOrder){auditTimelineAdd(q,event);assert.deepEqual(auditTimelineRestore(q),q);}q.trials[id].answer=c.read==='allowed'?'denied':'allowed';assert.equal(auditTimelineCheck(q),false);q.trials[id].answer=c.read;assert.equal(auditTimelineCheck(q),true);}
 assert.equal(auditTimelineComplete(q),false);q.reflection='limits';assert.equal(auditTimelineComplete(q),true);const bad=structuredClone(q);bad.trials.gap.answer='allowed';assert.throws(()=>auditTimelineRestore(bad));
});
