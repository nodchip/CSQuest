import test from 'node:test';
import assert from 'node:assert/strict';
import {csgModes,csgCells,shapeContains,csgExpected,csgCorrect,csgErrors,createCsg,restoreCsg,csgComplete} from '../src/shape-csg.js';
test('shape combinations obey set identities and ordered differences',()=>{
 const a=new Set(csgCells.filter(k=>{const [r,c]=k.split(':').map(Number);return shapeContains('a',r,c);})),b=new Set(csgCells.filter(k=>{const [r,c]=k.split(':').map(Number);return shapeContains('b',r,c);}));
 assert.deepEqual(csgExpected('union').slice().sort(),[...new Set([...a,...b])].sort());assert.deepEqual(csgExpected('intersection').slice().sort(),[...a].filter(k=>b.has(k)).sort());assert.deepEqual(Object.keys(csgModes).map(m=>csgExpected(m).length),[15,3,6,6]);assert.notDeepEqual(csgExpected('aMinusB'),csgExpected('bMinusA'));
});
test('all four exact checked masks required; saved cells are validated',()=>{
 const s=createCsg();for(const mode of Object.keys(csgModes))s.choices[mode]={selected:csgExpected(mode),checked:true};assert.equal(csgComplete(s),true);const copy=restoreCsg(s);s.choices.union.selected.pop();assert.equal(csgComplete(s),false);assert.equal(csgErrors('union',s.choices.union),1);assert.equal(copy.choices.union.selected.length,15);copy.choices.union.selected=['1:1','1:1'];assert.throws(()=>restoreCsg(copy),RangeError);
});
test('legacy drafts are restored with a fresh three-dimensional exercise',()=>{
 const old=createCsg();delete old.solid;old.choices.union.selected=['1:1'];
 const restored=restoreCsg(old);assert.equal(restored.solid.mode,'union');assert.deepEqual(restored.choices.union.selected,['1:1']);
});
