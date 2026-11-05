import test from 'node:test';
import assert from 'node:assert/strict';
import {scrollArrayReplay,scrollArrayAct,createScroll,restoreScroll} from '../src/scroll-pipeline.js';
test('filtering processes positions in order and keeps duplicate values',()=>{const q={history:[]};assert.throws(()=>scrollArrayAct(q,'skip'));assert.deepEqual(q.history,[]);for(const a of ['keep','skip','keep','keep'])scrollArrayAct(q,a);assert.deepEqual(scrollArrayReplay(q.history),{index:4,output:['A','A','C'],done:true});assert.throws(()=>scrollArrayAct(q,'keep'));});
test('older drafts gain an empty array exercise and incorrect histories are rejected',()=>{const {array,...old}=createScroll();assert.deepEqual(restoreScroll(old),createScroll());assert.throws(()=>restoreScroll({...old,array:{history:['skip']}}));const q=createScroll();q.array.history=['keep','skip'];const copy=restoreScroll(q);copy.array.history.push('keep');assert.equal(q.array.history.length,2);});
