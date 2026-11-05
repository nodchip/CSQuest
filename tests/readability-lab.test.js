import test from 'node:test';
import assert from 'node:assert/strict';
import {readabilityAnswer,createReadabilityLab,restoreReadabilityLab} from '../src/readability-lab.js';
import {createOrthogonalLanguage,restoreOrthogonalLanguage} from '../src/language-orthogonality.js';
test('the fixed named and explained forms determine an item; unexplained symbols do not',()=>{for(const v of ['moon','star'])for(const c of ['none','legend']){assert.equal(readabilityAnswer('named',c,v),v);assert.equal(readabilityAnswer('symbol',c,v),c==='none'?'unknown':v);}assert.throws(()=>readabilityAnswer('unknown','none','moon'));});
test('older drafts migrate and comparison records are copied and validated',()=>{const q=createOrthogonalLanguage();delete q.readability;assert.deepEqual(restoreOrthogonalLanguage(q).readability,createReadabilityLab());const r=createReadabilityLab();r.seen=['moon:symbol:none'];r.guess='unknown';r.checked=true;const copy=restoreReadabilityLab(r);copy.seen.push('star:symbol:none');assert.equal(r.seen.length,1);assert.throws(()=>restoreReadabilityLab({...r,seen:['bad']}));});
