import test from 'node:test';
import assert from 'node:assert/strict';
import {syndromeOf,syndromeRun,syndromeCases,syndromeCreate,syndromeCheck,syndromeDone,syndromeRestore} from '../src/syndrome-control.js';
test('all bit masks have the expected parity syndrome and standard correction',()=>{
 const rules={'00':'none','10':'left','11':'middle','01':'right'};
 assert.deepEqual(Array.from({length:8},(_,x)=>syndromeOf(x)),['00','10','11','01','01','11','10','00']);
 for(const id of Object.keys(syndromeCases)){const r=syndromeRun(id,rules);assert.equal(r.restored,['none','left','middle','right'].includes(id));}
 assert.equal(syndromeRun('double',rules).remainingX,7);assert.equal(syndromeRun('phase',rules).remainingZ,2);
});
test('all examples and correct rules are required; saved selections are independent',()=>{
 const q=syndromeCreate();q.rules={'00':'none','10':'left','11':'middle','01':'right'};
 q.prediction='not-restored';assert.equal(syndromeCheck(q).correct,false);
 for(const id of Object.keys(syndromeCases)){q.selected=id;q.prediction=['double','phase'].includes(id)?'not-restored':'restored';assert.equal(syndromeCheck(q).correct,true);}
 assert.equal(syndromeDone(q),false);q.reflection='limits';assert.equal(syndromeDone(syndromeRestore(q)),true);
 const copy=syndromeRestore(q);copy.rules['00']='left';assert.equal(q.rules['00'],'none');assert.throws(()=>syndromeRestore({...q,seen:['left','left']}),RangeError);
});
