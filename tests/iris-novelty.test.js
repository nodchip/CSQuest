import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {irisSetosa} from '../src/iris-setosa.js';
import {irisNoveltyResult,createIrisNovelty,irisNoveltyComplete,restoreIrisNovelty} from '../src/iris-novelty.js';
test('all 50 withheld-species measurements match the raw source',()=>{const rows=readFileSync(new URL('../data/iris.data',import.meta.url),'utf8').trim().split(/\r?\n/).map(x=>x.split(','));assert.ok(rows.slice(0,50).every(r=>r[4]==='Iris-setosa'));assert.deepEqual(irisSetosa,rows.slice(0,50).map(r=>[Math.round(Number(r[2])*10),Math.round(Number(r[3])*10)]));});
test('all limits match independently computed rational-distance counts',()=>{const expected=[[20,0],[17,50],[20,50],[20,49]];for(let i=0;i<4;i++){const r=irisNoveltyResult(i);assert.deepEqual([r.knownAccepted,r.novelRejected],expected[i]);assert.equal(r.knownTotal,20);assert.equal(r.novelTotal,50);assert.ok(r.knownCorrect<=r.knownAccepted);}assert.throws(()=>irisNoveltyResult(4));});
test('four comparisons, the stated sample objective and a limitation reflection are required',()=>{const s=createIrisNovelty();Object.assign(s,{selected:2,tried:15,reflection:'limits',checked:true});assert.ok(irisNoveltyComplete(s));assert.deepEqual(restoreIrisNovelty(s),s);assert.ok(!irisNoveltyComplete({...s,selected:0}));assert.ok(!irisNoveltyComplete({...s,selected:1}));assert.throws(()=>restoreIrisNovelty({...s,tried:16}));});
