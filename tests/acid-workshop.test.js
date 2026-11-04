import test from 'node:test';
import assert from 'node:assert/strict';
import {acidCases,acidRun,acidCreate,acidCheck,acidDone,acidRestore} from '../src/acid-workshop.js';
test('four concrete fault and protection pairs have the expected final states',()=>{
 const expected={atomic:['北2・南1','北5・南1'],consistency:['北-1・南7','北1・南5'],isolation:['在庫1','在庫0'],durability:['再起動後4','再起動後7']};
 for(const id of Object.keys(acidCases)){assert.equal(acidRun(id,false).after,expected[id][0]);assert.equal(acidRun(id,false).ok,false);assert.equal(acidRun(id,true).after,expected[id][1]);assert.equal(acidRun(id,true).ok,true);}
 assert.throws(()=>acidRun('unknown',true),RangeError);
});
test('all eight experiments need the property and outcome, and drafts are copied',()=>{
 const q=acidCreate();q.property='durability';q.prediction='fail';assert.equal(acidCheck(q).correct,false);assert.deepEqual(q.seen,[]);
 for(const id of Object.keys(acidCases))for(const protect of [false,true]){q.selected=id;q.protect=protect;q.property=id;q.prediction=protect?'ok':'fail';assert.equal(acidCheck(q).correct,true);}
 assert.equal(acidDone(q),false);q.reflection='scope';assert.equal(acidDone(acidRestore(q)),true);
 const c=acidRestore(q);c.seen.pop();assert.equal(q.seen.length,8);assert.throws(()=>acidRestore({...q,seen:['atomic:fixed','atomic:fixed']}),RangeError);
});
