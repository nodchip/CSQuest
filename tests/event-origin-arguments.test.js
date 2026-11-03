import test from 'node:test';
import assert from 'node:assert/strict';
import {originReplay,originCaseDone,originCreate,originRestore,originDone} from '../src/event-origin-arguments.js';
test('external events keep source and target; processing the blue event queues a program event',()=>{
 const s=originReplay(['left','right','dispatch']);assert.equal(s.left,1);assert.equal(s.right,0);assert.deepEqual(s.queue,[{source:'right',target:'right',amount:1},{source:'timer',target:'left',amount:2}]);
 const end=originReplay(['left','right','dispatch','dispatch','dispatch']);assert.deepEqual(end.processed.map(e=>e.source),['left','right','timer']);assert.deepEqual([end.left,end.right],[3,1]);assert.deepEqual(end.processed[2],{source:'timer',target:'left',amount:2});
 assert.throws(()=>originReplay(['dispatch']));assert.throws(()=>originReplay(['left','left']));assert.throws(()=>originReplay(['left','dispatch','dispatch','dispatch']));
});
test('two target orders lead to the same values but require different event sequences',()=>{
 const queued=['left','right','dispatch','dispatch','dispatch'],interleaved=['left','dispatch','dispatch','right','dispatch'];assert.equal(originCaseDone('queued',queued),true);assert.equal(originCaseDone('interleaved',queued),false);assert.equal(originCaseDone('interleaved',interleaved),true);assert.equal(originCaseDone('queued',interleaved),false);assert.deepEqual([originReplay(interleaved).left,originReplay(interleaved).right],[3,1]);
});
test('both cases and reflections are required; restoration copies histories and rejects invalid traces',()=>{
 const q=originCreate();q.histories.queued=['left','right','dispatch','dispatch','dispatch'];q.histories.interleaved=['left','dispatch','dispatch','right','dispatch'];q.sender='source';q.order='different';assert.equal(originDone(q),true);assert.equal(originDone({...q,order:'same'}),false);assert.equal(originDone({...q,sender:'target'}),false);assert.equal(originDone({...q,histories:{...q.histories,queued:[]}}),false);
 const r=originRestore(q);r.histories.queued.pop();assert.equal(q.histories.queued.length,5);assert.throws(()=>originRestore({...q,histories:{...q.histories,queued:['dispatch']}}));
});
