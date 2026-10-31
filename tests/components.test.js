import test from 'node:test';
import assert from 'node:assert/strict';
import {componentPixels,componentSeed,componentsFor,componentCorrect,createComponents,restoreComponents,componentsComplete} from '../src/components.js';
test('four and eight connectivity yield different components on the same binary image',()=>{
 const four=componentsFor('four'),eight=componentsFor('eight');assert.equal(four.length,2);assert.deepEqual(four.find(g=>g.includes(componentSeed)).slice().sort(),['1:1','1:2','2:2']);assert.equal(eight.length,1);assert.deepEqual(eight[0].slice().sort(),componentPixels.slice().sort());
});
test('correct component and count required; saved selections validate and copy',()=>{
 const s=createComponents();s.choices.four={selected:['2:2','1:2','1:1'],count:2,checked:true};s.choices.eight={selected:componentPixels.slice(),count:1,checked:true};assert.equal(componentsComplete(s),true);const r=restoreComponents(s);s.choices.four.count=1;assert.equal(componentCorrect('four',s.choices.four),false);assert.equal(r.choices.four.count,2);r.choices.four.selected=['0:0'];assert.throws(()=>restoreComponents(r),RangeError);
});
