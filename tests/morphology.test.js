import test from 'node:test';
import assert from 'node:assert/strict';
import {morphologyImage,morphologyCells,morphologyExpected,morphologyAt,morphologyCorrect,morphologyErrors,createMorphology,restoreMorphology,morphologyComplete} from '../src/morphology.js';
test('cross dilation expands each input point, erosion leaves only center with zero outside',()=>{
 const independent=new Set();for(let r=0;r<5;r++)for(let c=0;c<5;c++)if(morphologyImage[r][c])for(const [dr,dc] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const x=r+dr,y=c+dc;if(x>=0&&x<5&&y>=0&&y<5)independent.add(`${x}:${y}`);}assert.deepEqual([...morphologyExpected('dilate')].sort(),[...independent].sort());assert.deepEqual(morphologyExpected('erode'),['2:2']);assert.equal(morphologyAt('erode',4,4),false);assert.equal(morphologyAt('dilate',4,4),true);assert.equal(morphologyCells.length,25);
});
test('complete requires both exact outputs and checked state; drafts validate and copy',()=>{
 const s=createMorphology();for(const mode of ['dilate','erode'])s.choices[mode]={selected:morphologyExpected(mode),checked:true};assert.equal(morphologyComplete(s),true);const copy=restoreMorphology(s);s.choices.erode.selected=[];assert.equal(morphologyComplete(s),false);assert.equal(morphologyErrors('erode',s.choices.erode),1);assert.equal(copy.choices.erode.selected.length,1);copy.choices.erode.selected=['2:2','2:2'];assert.throws(()=>restoreMorphology(copy),RangeError);
});
