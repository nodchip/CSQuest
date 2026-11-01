import test from 'node:test';
import assert from 'node:assert/strict';
import {createIteratorTrail,iteratorTrailStep,iteratorTrailComplete,restoreIteratorTrail} from '../src/iterator-trail.js';

test('independent iterators, own removal and stale iterator recovery',()=>{
 let s=createIteratorTrail();for(const action of ['nextA','nextA','nextB'])s=iteratorTrailStep(s,action);assert.equal(s.iterators.A.cursor,2);assert.equal(s.iterators.B.cursor,1);
 const before=s;s=iteratorTrailStep(s,'removeA');assert.deepEqual(before.items,['A','B','C']);assert.deepEqual(s.items,['A','C']);assert.equal(s.iterators.A.cursor,1);assert.equal(s.iterators.A.version,s.version);assert.notEqual(s.iterators.B.version,s.version);
 s=iteratorTrailStep(s,'nextA');assert.match(s.message,/依頼 C/);s=iteratorTrailStep(s,'nextB');assert.match(s.message,/操作できません/);s=iteratorTrailStep(s,'restartB');s=iteratorTrailStep(s,'nextB');assert.match(s.message,/依頼 A/);s=iteratorTrailStep(s,'nextB');assert.match(s.message,/依頼 C/);assert.equal(s.stage,9);assert.equal(iteratorTrailComplete({...s,answer:'independent',checked:true}),true);
 const restored=restoreIteratorTrail({history:s.history,answer:'independent',checked:true});assert.deepEqual(restored.items,['A','C']);assert.equal(restored.stage,9);assert.throws(()=>iteratorTrailStep(s,'nextA'));
});
test('remove needs a last element, is once per read and restart discards it',()=>{
 let s=createIteratorTrail();s=iteratorTrailStep(s,'removeA');assert.deepEqual(s.items,['A','B','C']);s=iteratorTrailStep(s,'nextA');s=iteratorTrailStep(s,'removeA');assert.deepEqual(s.items,['B','C']);s=iteratorTrailStep(s,'removeA');assert.deepEqual(s.items,['B','C']);s=iteratorTrailStep(s,'restartA');s=iteratorTrailStep(s,'removeA');assert.deepEqual(s.items,['B','C']);assert.throws(()=>restoreIteratorTrail({history:['nope'],answer:null,checked:false}));
});
test('bounded arbitrary operations retain cursor and version invariants',()=>{
 const actions=['nextA','nextB','removeA','removeB','restartA','restartB'];function explore(s,depth){assert.ok(s.version>=0);assert.equal(new Set(s.items).size,s.items.length);for(const it of Object.values(s.iterators)){assert.ok(it.cursor>=0);assert.ok(it.version<=s.version);if(it.version===s.version)assert.ok(it.cursor<=s.items.length);}if(!depth||s.stage===9)return;for(const a of actions)explore(iteratorTrailStep(s,a),depth-1);}explore(createIteratorTrail(),5);
});
