import test from 'node:test';
import assert from 'node:assert/strict';
import {replayIo} from '../src/endgame-io.js';
const poll=['poll','work','poll','handle','work','check'],irq=['work','work','work','handle','work','check'];
test('polling observes readiness at the third tick and can do work between checks',()=>{
 let p=replayIo('poll',['poll']);assert.equal(p.state.tick,1);assert.equal(p.state.ready,false);assert.equal(p.state.polls,1);
 assert.equal(replayIo('poll',['poll','handle']),null);p=replayIo('poll',['poll','work','poll']);assert.equal(p.state.ready,true);assert.equal(p.state.seen,true);assert.equal(p.state.work,1);
 p=replayIo('poll',poll);assert.equal(p.done,true);assert.deepEqual([p.results[0].tick,p.results[0].work,p.results[0].polls],[5,2,2]);
});
test('notification is pending before CPU acceptance, then handler finishes and work resumes',()=>{
 const partial=['work','work','work'];let p=replayIo('interrupt',JSON.parse(JSON.stringify(partial)));assert.equal(p.state.pending,true);assert.equal(p.state.handled,false);
 assert.equal(replayIo('interrupt',[...partial,'work']),null);p=replayIo('interrupt',[...partial,'handle']);assert.equal(p.state.pending,false);assert.equal(p.state.handled,true);
 p=replayIo('interrupt',irq);assert.equal(p.done,true);assert.deepEqual([p.results[0].tick,p.results[0].work,p.results[0].polls],[5,4,0]);
});
test('compare requires both runs, uses fixed counts, and rejects later actions',()=>{
 assert.equal(replayIo('compare',[...poll,'answer:interrupt']),null);const runs=[...poll,...irq];assert.equal(replayIo('compare',[...runs,'answer:poll']),null);
 const p=replayIo('compare',[...runs,'answer:interrupt']);assert.equal(p.done,true);assert.deepEqual(p.results.map(x=>x.work),[2,4]);assert.equal(replayIo('compare',[...runs,'answer:interrupt','work']),null);
});
