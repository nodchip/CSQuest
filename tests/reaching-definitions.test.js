import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reachingDefs,reachingCorrect,createReaching,reachingComplete,restoreReaching} from '../src/reaching-definitions.js';

test('each point accepts exactly the definitions independently obtained from both paths',()=>{
 const keys=Object.keys(reachingDefs),expected={join:['first','branch'],after:['overwrite']};
 for(const id of Object.keys(expected))for(let mask=0;mask<8;mask++){const marks=keys.filter((_,i)=>mask&(1<<i));assert.equal(reachingCorrect(id,marks),marks.length===expected[id].length&&expected[id].every(x=>marks.includes(x)));}
});
test('completion requires both checked sets and restores a defensive copy',()=>{
 const s=createReaching();s.trials.join={marks:['first','branch'],checked:true};s.trials.after={marks:['overwrite'],checked:true};const restored=restoreReaching(s);assert.equal(reachingComplete(restored),true);
 s.trials.join.marks.pop();assert.equal(reachingComplete(restored),true);assert.throws(()=>restoreReaching(s),RangeError);
 restored.trials.after.marks.push('branch');assert.equal(reachingComplete(restored),false);assert.throws(()=>restoreReaching(restored),RangeError);
});
