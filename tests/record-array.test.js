import test from 'node:test';
import assert from 'node:assert/strict';
import {recordArrayAddress,createRecordArray,restoreRecordArray} from '../src/record-layout.js';
import {createRecordLab,restoreRecordLab} from '../src/record-layout.js';
test('the second record begins after the whole first record, including padding',()=>{assert.deepEqual(['mark','count','flag'].map(x=>recordArrayAddress('scattered',x)),[112,116,120]);assert.deepEqual(['mark','count','flag'].map(x=>recordArrayAddress('grouped',x)),[112,108,113]);assert.throws(()=>recordArrayAddress('other','mark'));});
test('older record labs add a separate valid and independent array history',()=>{const r=createRecordLab();delete r.array;assert.deepEqual(restoreRecordLab(r).array,createRecordArray());const a=createRecordArray();a.seen=['scattered:flag'];let b=restoreRecordArray(a);b.seen.push('grouped:mark');assert.equal(a.seen.length,1);assert.throws(()=>restoreRecordArray({...a,seen:['bad']}));});
