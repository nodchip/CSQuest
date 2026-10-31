import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createDanglingTrial,danglingStep,restoreDanglingSet,danglingComplete} from '../src/dangling-reference.js';

test('freeing through P leaves Q dangling unless Q was cleared',()=>{
 let a=createDanglingTrial('dangling'),b=createDanglingTrial('cleared');
 assert.equal(danglingStep(a,'clear').phase,'prepare');a=danglingStep(a,'keep');b=danglingStep(b,'clear');
 assert.equal(a.q,'A');assert.equal(b.q,null);assert.equal(b.alive,true);a=danglingStep(a,'free');b=danglingStep(b,'free');
 assert.equal(danglingStep(a,'live').phase,'predict');assert.equal(danglingStep(b,'dangling').phase,'predict');
 a=danglingStep(a,'dangling');b=danglingStep(b,'empty');assert.equal(a.phase,'done');assert.equal(b.phase,'done');
});
test('saved histories reconstruct both cases and reject impossible histories',()=>{
 const saved={selected:'cleared',histories:{dangling:['keep','free','dangling'],cleared:['clear','free','empty']}};
 assert.equal(danglingComplete(restoreDanglingSet(saved)),true);
 assert.throws(()=>restoreDanglingSet({selected:'cleared',histories:{dangling:['keep','free','live'],cleared:[]}}),RangeError);
 assert.throws(()=>restoreDanglingSet({selected:'dangling',histories:{dangling:['free'],cleared:[]}}),RangeError);
});
