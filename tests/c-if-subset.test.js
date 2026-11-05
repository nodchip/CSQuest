import test from 'node:test';
import assert from 'node:assert/strict';
import {cCases,cSubsetAccept,createCSubset,restoreCSubset} from '../src/c-if-subset.js';
import {railCreate,railRestore} from '../src/syntax-rail.js';
test('the selected EBNF accepts the two listed C if forms, with a constrained body and condition',()=>{const expected={one:[false,true,false,false,false],optional:[true,true,false,false,false],many:[true,true,false,true,false]};for(const rule of Object.keys(expected))assert.deepEqual(Object.values(cCases).map(c=>cSubsetAccept(rule,c.tokens)),expected[rule]);assert.throws(()=>cSubsetAccept('bad',[]));});
test('previous rail drafts gain independent C subset exploration',()=>{const q=railCreate();delete q.cLab;assert.deepEqual(railRestore(q).cLab,createCSubset());const s=createCSubset();s.rule='optional';s.seen=['simple'];const t=restoreCSubset(s);t.seen.push('both');assert.equal(s.seen.length,1);assert.throws(()=>restoreCSubset({...s,rule:'one'}));});
