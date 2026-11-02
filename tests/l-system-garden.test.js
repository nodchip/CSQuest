import {test} from 'node:test';
import assert from 'node:assert/strict';
import {lsystemRule,lsystemWord,lsystemSegments,lsystemCreate,lsystemGuessOptions,lsystemAdvance,lsystemComplete,lsystemRestore} from '../src/l-system-garden.js';

test('parallel rewriting keeps branch symbols and grows five forward commands per generation',()=>{
 assert.equal(lsystemWord(0),'F');assert.equal(lsystemWord(1),lsystemRule);
 for(let d=0;d<=3;d++){const word=lsystemWord(d),lines=lsystemSegments(word);assert.equal([...word].filter(c=>c==='F').length,5**d);assert.equal(lines.length,5**d);assert.equal([...word].filter(c=>c==='[').length,[...word].filter(c=>c===']').length);}
 const lines=lsystemSegments(lsystemRule),near=(a,b)=>Math.abs(a-b)<1e-9;
 assert.ok(near(lines[0][2],0)&&near(lines[0][3],-1));assert.ok(near(lines[1][0],lines[0][2])&&near(lines[1][1],lines[0][3]));assert.ok(near(lines[2][0],lines[0][2])&&near(lines[2][1],lines[0][3]));assert.ok(near(lines[4][2],0)&&near(lines[4][3],-3));
 assert.throws(()=>lsystemSegments('F]'));assert.throws(()=>lsystemSegments('F['));assert.throws(()=>lsystemWord(4));
});
test('incorrect predictions do not advance and restoration validates each generation',()=>{
 let q=lsystemCreate();for(const correct of [5,25,125]){q.guess=lsystemGuessOptions(q)[0];assert.equal(lsystemAdvance(q),false);q.guess=correct;assert.equal(lsystemAdvance(q),true);q=lsystemRestore(q);}
 assert.equal(lsystemComplete(q),false);q.answer='parallel';assert.equal(lsystemComplete(q),true);const copy=lsystemRestore(q);copy.history.pop();assert.equal(q.history.length,3);assert.equal(lsystemComplete(copy),false);assert.throws(()=>lsystemRestore({history:[5,50],guess:null,answer:null}));assert.throws(()=>lsystemRestore({history:[5,25,125],guess:10,answer:null}));
});
