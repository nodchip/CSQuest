import test from 'node:test';
import assert from 'node:assert/strict';
import {ledgerSetModes,resultCounts,ledgerSetCorrect,createLedgerSets,restoreLedgerSets,ledgerSetsComplete} from '../src/ledger-sets.js';
test('set and bag operations have the correct independent multiplicities',()=>{
 assert.deepEqual(resultCounts('union'),{ao:1,beni:1,kuro:1});assert.deepEqual(resultCounts('unionAll'),{ao:1,beni:3,kuro:1});assert.deepEqual(resultCounts('intersection'),{ao:0,beni:1,kuro:0});assert.deepEqual(resultCounts('difference'),{ao:1,beni:0,kuro:0});
 for(const mode of Object.keys(ledgerSetModes)){let accepted=0;for(let a=0;a<=3;a++)for(let b=0;b<=3;b++)for(let c=0;c<=3;c++)if(ledgerSetCorrect(mode,{checked:true,counts:{ao:a,beni:b,kuro:c}}))accepted++;assert.equal(accepted,1);}
});
test('four checked trials are needed and restored progress is validated',()=>{
 const s=createLedgerSets();for(const mode of Object.keys(ledgerSetModes))s.choices[mode]={counts:resultCounts(mode),checked:true};assert.equal(ledgerSetsComplete(s),false);for(const [id,count] of Object.entries({nameAll:4,nameDistinct:2,pairAll:4,pairDistinct:3}))s.projection.choices[id]={count,checked:true};assert.equal(ledgerSetsComplete(s),true);const copy=restoreLedgerSets(s);s.choices.union.counts.ao=0;assert.equal(ledgerSetsComplete(s),false);assert.equal(copy.choices.union.counts.ao,1);copy.choices.union.counts.ao=99;assert.throws(()=>restoreLedgerSets(copy),RangeError);const {projection,...old}=s;assert.equal(ledgerSetsComplete(restoreLedgerSets(old)),false);
});
