import test from 'node:test';
import assert from 'node:assert/strict';
import {materialResult,materialCreate,materialRestore} from '../src/material-repair.js';
import {createNoticeImpact,restoreNoticeImpact} from '../src/notice-impact-review.js';
test('the finite service period counts only the assumed replacement or repair',()=>{assert.deepEqual([materialResult('3','repair').total,materialResult('3','replace').total,materialResult('6','repair').total,materialResult('6','replace').total],[10,10,12,20]);assert.equal(materialResult('3','repair').events,0);assert.equal(materialResult('6','replace').events,1);assert.throws(()=>materialResult('9','repair'));});
test('old impact records gain independently restored material observations',()=>{const old=createNoticeImpact();delete old.materialLab;assert.deepEqual(restoreNoticeImpact(old).materialLab,materialCreate());const s=materialCreate();s.seen.push('6:repair');const copy=materialRestore(s);copy.seen.pop();assert.equal(s.seen.length,1);assert.throws(()=>materialRestore({...s,seen:['bad']}));});
