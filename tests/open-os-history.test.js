import {test} from 'node:test';
import assert from 'node:assert/strict';
import {openOsEvents,openOsCases,openOsPlans,openOsCreate,openOsAdd,openOsCheckTimeline,openOsCheckCase,openOsComplete,openOsRestore} from '../src/open-os-history.js';

test('only the chronological permutation matches the historical dates',()=>{
 const ids=Object.keys(openOsEvents);let accepted=0;for(const a of ids)for(const b of ids)for(const c of ids){if(new Set([a,b,c]).size!==3)continue;const q=openOsCreate();for(const id of [a,b,c])assert.equal(openOsAdd(q,id),true);const expected=openOsEvents[a].year<openOsEvents[b].year&&openOsEvents[b].year<openOsEvents[c].year;assert.equal(openOsCheckTimeline(q),expected);if(expected)accepted++;}assert.equal(accepted,1);
});
test('the stated requirements select one plan in each case and saved checks are verified',()=>{
 let q=openOsCreate();for(const id of ['gnu','linux','gpl'])openOsAdd(q,id);assert.equal(openOsCheckTimeline(q),true);for(const [id,c] of Object.entries(openOsCases)){for(const [plan,p] of Object.entries(openOsPlans)){const expected=id==='budget'?p.source&&p.cost===0:id==='service'?p.source&&p.cost<=6&&p.response:p.tool&&p.cost<=6;q.trials[id].choice=plan;assert.equal(openOsCheckCase(q,id),expected,`${id}:${plan}`);}q.trials[id].choice=c.correct;openOsCheckCase(q,id);}q=openOsRestore(q);assert.equal(openOsComplete(q),false);q.open='review';q.service='response';assert.equal(openOsComplete(q),true);const copy=openOsRestore(q);copy.trials.budget.choice='support';assert.equal(openOsComplete(q),true);assert.equal(openOsComplete(copy),false);assert.throws(()=>openOsRestore(copy));assert.throws(()=>openOsRestore({...q,order:['gnu','gnu']}));
});
