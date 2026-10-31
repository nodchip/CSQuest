import test from 'node:test';
import assert from 'node:assert/strict';
import {ledgerRows,changedRows,splitAndJoin,sameLedger,decompositionResult,createDecomposition,restoreDecomposition,decompositionComplete} from '../src/decomposition.js';
test('changing one duplicated village name leaves contradictory values',()=>{
  const rows=changedRows();assert.deepEqual(rows.filter(r=>r.village==='V1').map(r=>r.name),['新森','森']);assert.equal(ledgerRows[0].name,'森');
});
test('village-key join reconstructs three rows; same-name join creates three additional rows',()=>{
  const correct=splitAndJoin('village'),bad=splitAndJoin('name');assert.equal(correct.length,3);assert.ok(sameLedger(correct,ledgerRows));assert.equal(bad.length,6);assert.equal(sameLedger(bad,ledgerRows),false);
  assert.deepEqual(bad.filter(row=>!ledgerRows.some(orig=>orig.order===row.order&&orig.village===row.village)).map(row=>`${row.order}/${row.village}`).sort(),['O1/V2','O2/V2','O3/V1']);
});
test('answers must match both count and reconstruction, and saved values are validated',()=>{
  const s=createDecomposition();s.choices.update={anomaly:'yes',checked:true};s.choices.village={count:3,restored:'yes',checked:true};s.choices.name={count:6,restored:'no',checked:true};assert.equal(decompositionComplete(restoreDecomposition(s)),true);
  assert.equal(decompositionResult('name',{count:6,restored:'yes'}).restored,false);s.choices.name.count=4;assert.equal(decompositionComplete(s),false);assert.throws(()=>restoreDecomposition({...s,choices:{...s.choices,name:{count:9,restored:'no',checked:true}}}),RangeError);
});
