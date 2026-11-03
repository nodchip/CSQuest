import test from 'node:test';
import assert from 'node:assert/strict';
import {designSecurityCreate,designSecurityAct,designSecurityReplay,designSecurityRestore} from '../src/design-security-journey.js';

test('the journey requires testing and recovering from unsuitable choices in both places',()=>{
 const q=designSecurityCreate(),act=a=>designSecurityAct(q,a);
 assert.throws(()=>act('next'),RangeError);assert.throws(()=>act('confirm:version'),RangeError);
 for(const a of ['client:archive','client:first','client:newcomer','confirm:version'])act(a);
 assert.equal(designSecurityReplay(q.history).villageDone,false);
 for(const a of ['version:coexist','client:archive','client:first','client:newcomer','confirm:version','next'])act(a);
 for(const a of ['visitor:healer','visitor:thief','visitor:unknown','confirm:policy'])act(a);
 assert.equal(designSecurityReplay(q.history).castleDone,false);
 let copy=designSecurityRestore(q);assert.deepEqual(copy,q);copy.history.pop();assert.notDeepEqual(copy,q);
 for(const a of ['policy:deny','visitor:healer','visitor:thief','visitor:unknown','confirm:policy','next','report'])act(a);
 assert.equal(designSecurityReplay(q.history).won,true);assert.throws(()=>act('back'),RangeError);
});
test('switching a design clears only its own trials and rejects invalid history',()=>{
 const q=designSecurityCreate();designSecurityAct(q,'client:archive');designSecurityAct(q,'version:coexist');assert.deepEqual(designSecurityReplay(q.history).tested,[]);
 assert.throws(()=>designSecurityRestore({history:['version:missing']}),RangeError);
});
