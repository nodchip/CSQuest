import {test} from 'node:test';
import assert from 'node:assert/strict';
import {impactCorrect,createImpact,impactComplete,restoreImpact} from '../src/design-impact.js';
test('all subsets for each fixed change match its actual affected components',()=>{
 const expected={directStorage:7,directPolicy:3,hiddenStorage:4,hiddenPolicy:4},parts=['screen','request','warehouse'];
 for(const [id,answer] of Object.entries(expected))for(let mask=0;mask<8;mask++)assert.equal(impactCorrect(id,parts.filter((_,i)=>mask&(1<<i))),mask===answer,`${id} ${mask}`);
 assert.equal(impactCorrect('unknown',[]),false);assert.equal(impactCorrect('hiddenPolicy',['warehouse','warehouse']),false);
});
test('saved trials are copied and completion requires checked correct choices',()=>{
 const s=createImpact();s.directStorage={marks:['screen','request','warehouse'],checked:true};s.directPolicy={marks:['screen','request'],checked:true};s.hiddenStorage={marks:['warehouse'],checked:true};s.hiddenPolicy={marks:['warehouse'],checked:true};const copy=restoreImpact(s);assert.equal(impactComplete(copy),true);s.hiddenPolicy.marks.push('screen');assert.equal(impactComplete(copy),true);assert.equal(impactComplete(s),false);copy.hiddenPolicy.checked=false;assert.equal(impactComplete(copy),false);assert.throws(()=>restoreImpact({...s,hiddenPolicy:{marks:['bad'],checked:true}}),RangeError);
});
