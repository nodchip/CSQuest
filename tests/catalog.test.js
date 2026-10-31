import test from 'node:test';
import assert from 'node:assert/strict';
import { ledgers, queryRows, evaluateQuery } from '../src/catalog.js';

test('all three conditions select the intended records in both ledgers', () => {
  const result=evaluateQuery({herb:true,east:true,available:true});
  assert.ok(result.every(item=>item.correct));
  assert.deepEqual(result.map(item=>item.rows.map(row=>row.id)),[['A','D'],['F']]);
});
test('omitting any condition admits unwanted records', () => {
  for(const missing of ['herb','east','available']) {
    const conditions={herb:true,east:true,available:true,[missing]:false};
    assert.ok(evaluateQuery(conditions).every(item=>!item.correct));
  }
});
test('no filters returns all rows without mutating the input', () => {
  const rows=ledgers[0].rows;
  assert.equal(queryRows(rows,{}).length,rows.length);
  assert.equal(rows[0].id,'A');
});
