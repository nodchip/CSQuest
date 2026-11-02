import test from 'node:test';
import assert from 'node:assert/strict';
import {ioReplay,ioStep,ioNotificationsCreate,ioNotificationsComplete,ioNotificationsRestore} from '../src/io-notifications.js';

function run(id,actions){let history=[];for(const action of actions){const next=ioStep(id,history,action);assert.equal(next.ok,true,`${id}: ${action}`);history=next.history;}return history;}
test('both ready channels may be read in either order',()=>{
 for(const actions of [['poll','read-a','read-b'],['poll','read-b','read-a']])assert.equal(ioReplay('multiplex',run('multiplex',actions)).done,true);
 assert.equal(ioStep('multiplex',[],'read-a').ok,false);assert.equal(ioStep('multiplex',['poll','read-a'],'read-a').ok,false);
});
test('stale readiness causes a retry, while completion is not available before notification',()=>{
 const stale=run('stale',['poll','compete','read-a','advance','poll','read-a']);assert.equal(ioReplay('stale',stale).done,true);assert.equal(ioReplay('stale',stale.slice(0,3)).wouldBlock,true);
 const completion=run('completion',['submit','check','work','advance','advance','collect']);assert.equal(ioReplay('completion',completion).done,true);assert.equal(ioStep('completion',completion.slice(0,4),'collect').ok,false);assert.throws(()=>ioReplay('stale',['poll','advance']));
});
test('all three histories and reflection are required and survive validated restore',()=>{
 const s=ioNotificationsCreate();s.trials.multiplex=run('multiplex',['poll','read-a','read-b']);s.trials.stale=run('stale',['poll','compete','read-a','advance','poll','read-a']);s.trials.completion=run('completion',['submit','check','work','advance','advance','collect']);assert.equal(ioNotificationsComplete(s),false);s.reflection='distinguish';assert.equal(ioNotificationsComplete(s),true);const copy=ioNotificationsRestore(s);copy.trials.stale.pop();assert.equal(ioNotificationsComplete(copy),false);assert.equal(ioNotificationsComplete(s),true);copy.trials.stale.push('unknown');assert.throws(()=>ioNotificationsRestore(copy));
});
