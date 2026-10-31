import test from 'node:test';
import assert from 'node:assert/strict';
import {arrayLayoutOrder,createArrayLayoutTrial,stepArrayLayout,arrayLayoutCorrect,createArrayLayoutSet,arrayLayoutComplete,restoreArrayLayout} from '../src/array-layout.js';

test('row and column placement map each coordinate to the expected offset',()=>{
  const all=createArrayLayoutSet();for(const [mode,answer] of [['row','107'],['column','105']]){let s=createArrayLayoutTrial(mode);for(let n=0;n<9;n++){const expected=mode==='row'?Math.floor(n/3)*3+n%3:(n%3)*3+Math.floor(n/3);assert.equal(arrayLayoutOrder(mode)[n],expected);s=stepArrayLayout(s,expected);}s.answer=answer;s.checked=true;assert.ok(arrayLayoutCorrect(s));all.trials[mode]=s;}assert.ok(arrayLayoutComplete(all));
});
test('incorrect positions cannot advance and unfinished layouts restore',()=>{
  let s=createArrayLayoutTrial('column');assert.equal(stepArrayLayout(s,1).history.length,0);s=stepArrayLayout(s,0);s=stepArrayLayout(s,3);const trials={row:{history:[],answer:'',checked:false},column:{history:s.history,answer:'',checked:false}};assert.deepEqual(restoreArrayLayout({selected:'column',trials}).trials.column.history,[0,3]);assert.throws(()=>restoreArrayLayout({selected:'column',trials:{...trials,column:{...trials.column,history:[1]}}}));
});
