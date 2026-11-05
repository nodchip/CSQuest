import test from 'node:test';
import assert from 'node:assert/strict';
import {roiResult,roiCreate,roiRestore} from '../src/inclusion-roi.js';
import {cycleCreate,cycleRestore} from '../src/inclusive-cycle.js';
test('return uses the same assumed cost per hour and the stated observation period',()=>{assert.deepEqual([roiResult('3','1').percent,roiResult('3','2').percent,roiResult('6','1').percent,roiResult('6','2').percent],[-50,0,0,100]);assert.equal(roiResult('6','2').benefit,12);assert.throws(()=>roiResult('9','1'));});
test('legacy participation drafts gain independent ROI records',()=>{const old=cycleCreate();delete old.roi;assert.deepEqual(cycleRestore(old).roi,roiCreate());const s=roiCreate();s.seen.push('3:1');const copy=roiRestore(s);copy.seen.pop();assert.equal(s.seen.length,1);assert.throws(()=>roiRestore({...s,seen:['bad']}));});
