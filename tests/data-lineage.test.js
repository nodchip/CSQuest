import test from 'node:test';
import assert from 'node:assert/strict';
import {createLineage,lineageStep,lineageComplete,restoreLineage} from '../src/data-lineage.js';
test('reports retain source versions after a correction and recomputation records new lineage',()=>{
 let t=createLineage();assert.equal(lineageStep(t,'b2').phase,0);for(const a of ['a1','b1','build','correct','inspect','a1','b2','build'])t=lineageStep(t,a);assert.deepEqual(t.reports,[{sources:['a1','b1'],total:15},{sources:['a1','b2'],total:12}]);t.answer='snapshot';t.checked=true;assert.equal(lineageComplete(t),true);assert.deepEqual(restoreLineage(t),t);t.history.push('correct');assert.throws(()=>restoreLineage(t));
});
test('wrong or incomplete versions do not produce a report',()=>{let t=createLineage();t=lineageStep(t,'a1');assert.equal(lineageStep(t,'build').reports.length,0);for(const a of ['b1','build','correct','inspect','a1','b1'])t=lineageStep(t,a);assert.equal(lineageStep(t,'build').phase,3);});
