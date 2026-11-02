import {test} from 'node:test';
import assert from 'node:assert/strict';
import {pbdReplay,pbdCreate,pbdStep,pbdComplete,pbdRestore} from '../src/position-constraints.js';

test('each ordered projection follows known distances and preserves the fixed anchor',()=>{
 const left=pbdReplay('left',['left','right','left','right','left','right']);assert.deepEqual(left.trace,[[0,3,6],[0,2,6],[0,3,5],[0,2,5],[0,2.5,4.5],[0,2,4.5],[0,2.25,4.25]]);assert.deepEqual(left.lengths,[2.25,2]);
 const right=pbdReplay('right',['right','left','right','left','right','left']);assert.deepEqual(right.trace,[[0,3,6],[0,3.5,5.5],[0,2,5.5],[0,2.75,4.75],[0,2,4.75],[0,2.375,4.375],[0,2,4.375]]);assert.deepEqual(right.lengths,[2,2.375]);
 assert.throws(()=>pbdReplay('left',['right']));assert.throws(()=>pbdReplay('right',Array(7).fill('right')));
});
test('both orders and reflection are required; invalid choices do not advance and saved histories replay',()=>{
 let q=pbdCreate();assert.equal(pbdStep(q,'right'),false);for(const [id,order] of [['left',['left','right']],['right',['right','left']]]){q.selected=id;for(let i=0;i<6;i++)assert.equal(pbdStep(q,order[i%2]),true);q=pbdRestore(q);}
 assert.equal(pbdComplete(q),false);q.answer='interact';assert.equal(pbdComplete(q),true);const copy=pbdRestore(q);copy.histories.left.pop();assert.equal(pbdComplete(q),true);assert.equal(pbdComplete(copy),false);assert.throws(()=>pbdRestore({...q,histories:{...q.histories,left:['left','left']}}));
});
