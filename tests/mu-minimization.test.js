import {test} from 'node:test';
import assert from 'node:assert/strict';
import {muReplay,muCreate,muStep,muComplete,muRestore} from '../src/mu-minimization.js';

test('least zero terminates search; equal finite observations need not imply equal futures',()=>{
 assert.deepEqual(muReplay('moon',3).observations.map(x=>x.value),[1,1,0]);assert.equal(muReplay('moon',3).found,2);assert.throws(()=>muReplay('moon',4));
 assert.deepEqual(muReplay('star',4).observations,muReplay('mist',4).observations);assert.equal(muReplay('star',7).found,6);assert.equal(muReplay('mist',8).found,null);assert.equal(muReplay('mist',8).finished,true);assert.throws(()=>muReplay('mist',9));
});
test('three observations, least value and a partiality conclusion are required',()=>{
 let q=muCreate();for(const id of ['moon','star','mist']){q.selected=id;while(!muReplay(id,q.steps[id]).finished){muStep(q);q=muRestore(q);}q.answers[id]=({moon:'2',star:'6',mist:'unknown'})[id];}q.reflection='always';assert.equal(muComplete(q),false);q.reflection='partial';assert.equal(muComplete(q),true);const copy=muRestore(q);copy.answers.moon='5';assert.equal(muComplete(copy),false);assert.equal(muComplete(q),true);assert.throws(()=>muRestore({...q,steps:{...q.steps,moon:4}}));
});
