import test from 'node:test';
import assert from 'node:assert/strict';
import {recordLayout,createRecordLab,restoreRecordLab} from '../src/record-layout.js';
import {createArrayLayoutSet,restoreArrayLayout} from '../src/array-layout.js';
test('assumed alignment produces the expected offsets and array stride',()=>{assert.deepEqual(recordLayout('scattered'),{offsets:{mark:0,count:4,flag:8},size:12});assert.deepEqual(recordLayout('grouped'),{offsets:{count:0,mark:4,flag:5},size:8});assert.throws(()=>recordLayout('other'));});
test('old array drafts restore and separate record progress is checked and copied',()=>{const q=createArrayLayoutSet();delete q.record;assert.deepEqual(restoreArrayLayout(q).record,createRecordLab());const s=createRecordLab();s.seen.push('scattered:mark');const c=restoreRecordLab(s);c.seen.push('grouped:mark');assert.equal(s.seen.length,1);assert.throws(()=>restoreRecordLab({...s,seen:['bad']}));});
