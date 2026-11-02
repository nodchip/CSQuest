import test from 'node:test';
import assert from 'node:assert/strict';
import {transpose,transposeKeys} from '../src/transposition-route.js';
import {decipherCases,decipherGrid,decipherCipher,decipherCorrect,decipherCreate,decipherDone,decipherComplete,decipherRestore} from '../src/transposition-decipher.js';

test('placing each pair in its specified column inverts every column order',()=>{
 for(const c of Object.values(decipherCases))for(const key of transposeKeys()){
  const cipher=transpose(c.rows,key);assert.deepEqual(decipherGrid(cipher,key),c.rows);
  const partial=decipherGrid(cipher,key.slice(0,2));assert.equal(partial.flat().filter(x=>x!==null).length,4);
 }
 assert.equal(decipherCipher('unique').join(''),'木風火月土海水星');
});
test('specified order is required even when repeated columns happen to look identical',()=>{
 const s=decipherCreate();for(const [id,c] of Object.entries(decipherCases)){
  for(const key of transposeKeys())assert.equal(decipherCorrect(id,{placements:key}),key.every((n,i)=>n===c.key[i]));
  s.trials[id]={placements:[...c.key],checked:false};assert.equal(decipherDone(id,s.trials[id]),false);s.trials[id].checked=true;
 }
 assert.equal(decipherComplete(s),false);s.reflection='inverse';assert.equal(decipherComplete(s),true);
 const copy=decipherRestore(s);copy.trials.unique.placements.pop();assert.equal(s.trials.unique.placements.length,4);assert.throws(()=>decipherRestore(copy));
});
