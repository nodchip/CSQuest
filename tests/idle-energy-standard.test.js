import {test} from 'node:test';
import assert from 'node:assert/strict';
import {idleCases,idleDisplay,idleSystem,idleResult,idleCreate,idleRun,idleComplete,idleRestore} from '../src/idle-energy-standard.js';

test('all timer combinations agree with minute-by-minute independent accounting',()=>{
 for(const [id,c] of Object.entries(idleCases))for(const [display,d] of Object.entries(idleDisplay))for(const [system,s] of Object.entries(idleSystem)){
  let wattMinutes=0,awake=0,screen=0,sleep=0;for(const duration of c.intervals)for(let minute=0;minute<duration;minute++){const on=minute<s.minutes,lit=on&&minute<d.minutes;awake+=Number(on);screen+=Number(lit);sleep+=Number(!on);wattMinutes+=(on?30:2)+(lit?10:0);}
  const r=idleResult(id,display,system);assert.deepEqual([r.awake,r.screen,r.sleep,r.wattMinutes],[awake,screen,sleep,wattMinutes]);assert.equal(r.timeoutSubset,d.minutes<=15&&s.minutes<=30);
 }
 assert.equal(idleResult('long','d15','s30').wh,18.5);assert.equal(idleResult('interrupt','d15','s30').wattMinutes,1820);assert.equal(idleResult('long','never','never').wh,40);
});
test('both usage patterns need baseline and selected timers; saved runs are validated',()=>{
 let q=idleCreate();for(const id of Object.keys(idleCases)){q.selected=id;for(const [d,s] of [['never','never'],['d15','s30']]){q.display=d;q.system=s;idleRun(q);idleRun(q);q=idleRestore(q);}}assert.equal(q.runs.length,4);assert.equal(idleComplete(q),false);q.answer='scope';assert.equal(idleComplete(q),true);const copy=idleRestore(q);copy.runs.pop();assert.equal(idleComplete(q),true);assert.equal(idleComplete(copy),false);assert.throws(()=>idleRestore({...q,runs:['long:bad:s30']}));
});
