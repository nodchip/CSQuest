import test from 'node:test';
import assert from 'node:assert/strict';
import {blanketNodes,createBlanket,blanketCorrect,blanketComplete,restoreBlanket} from '../src/markov-blanket.js';
import {createDsep,restoreDsep} from '../src/d-separation.js';

test('each graph includes parents, children and coparents but not the extra node',()=>{
 assert.deepEqual([...blanketNodes('parent')].sort(),['C','P','Z']);
 assert.deepEqual([...blanketNodes('children')].sort(),['A','B','W']);
 const s=createBlanket();s.checked={parent:true,children:true};
 for(let mask=0;mask<16;mask++){
  s.masks.parent=mask;assert.equal(blanketCorrect(s,'parent'),mask===7);
  s.masks.children=mask;assert.equal(blanketCorrect(s,'children'),mask===7);
 }
 s.masks={parent:7,children:7};assert.equal(blanketComplete(s),true);
 const copy=restoreBlanket(s);copy.masks.parent=0;assert.equal(s.masks.parent,7);
 assert.throws(()=>restoreBlanket({...s,masks:{...s.masks,parent:16}}));
});
test('old progress restores with untried blankets',()=>{
 const {blanket,...old}=createDsep();
 assert.deepEqual(restoreDsep(old).blanket,createBlanket());
});
