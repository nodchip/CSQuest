import {test} from 'node:test';
import assert from 'node:assert/strict';
import {boundaryInputs,boundaryExpected,boundaryObserved,boundaryRun,boundaryMinimum,boundaryCreate,boundaryToggle,boundaryDone,boundaryRestore} from '../src/boundary-test-workshop.js';
test('the specification and three deliberately faulty mechanisms differ only at their stated values',()=>{assert.deepEqual(boundaryInputs.map(boundaryExpected),['invalid','closed','closed','closed','open','open','open','invalid']);for(const [v,bad] of [['low',-1],['edge',3],['high',6]])assert.deepEqual(boundaryInputs.filter(n=>boundaryObserved(v,n)!==boundaryExpected(n)),[bad]);});
test('partition coverage alone misses a boundary defect; selected boundary cases expose all examples',()=>{const representative=boundaryRun([-1,1,4,6]);assert.equal(representative.partitions.length,4);assert.deepEqual(representative.caught,['low','high']);const q=boundaryCreate();for(const n of [-1,2,3,6])boundaryToggle(q,n);assert.equal(boundaryDone(q),false);q.ran=true;q.reflection='limits';q.checked=true;assert.equal(boundaryDone(q),true);const copy=boundaryRestore(q);copy.selected.pop();assert.equal(q.selected.length,4);boundaryToggle(q,3);assert.equal(q.ran,false);assert.throws(()=>boundaryRestore({...q,selected:[2,2]}));});
test('the minimum needs each faulty input and one distinct closed input',()=>{
 assert.deepEqual(boundaryMinimum(),[[-1,0,3,6],[-1,1,3,6],[-1,2,3,6]]);
 const old=boundaryCreate();delete old.minimumGuess;delete old.minimumChecked;
 assert.equal(boundaryRestore(old).minimumChecked,false);
 assert.equal(boundaryRestore({...old,minimumGuess:4,minimumChecked:true}).minimumGuess,4);
 assert.throws(()=>boundaryRestore({...old,minimumChecked:true}));
 assert.throws(()=>boundaryRestore({...old,minimumGuess:2}));
});
