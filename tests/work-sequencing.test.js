import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createWork,stepWork,workRiskEarly,workComplete,restoreWork} from '../src/work-sequencing.js';
test('dependencies block premature work and early risk exploration permits a useful milestone',()=>{
 let s=createWork();s=stepWork(s,'finish:integrate');assert.deepEqual(s.done,[]);assert.match(s.message,/先に必要/);for(const id of ['contract','experiment','screen','storage','integrate','demo'])s=stepWork(s,`finish:${id}`);assert.equal(workComplete(s),true);s=stepWork(s,'undo');assert.equal(workComplete(s),false);
});
test('late risk exploration fails the objective and saved history is replayed',()=>{
 let s=createWork();for(const id of ['contract','storage','experiment','screen','integrate','demo'])s=stepWork(s,`finish:${id}`);assert.equal(workRiskEarly(s.done),false);assert.equal(workComplete(s),false);const copy=restoreWork({...s,done:['experiment']});assert.deepEqual(copy.done,s.done);assert.throws(()=>restoreWork({history:['finish:bad']}),RangeError);
});
