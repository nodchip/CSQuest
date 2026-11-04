import test from 'node:test';
import assert from 'node:assert/strict';
import {mitigationCases,mitigationForward,mitigationInvert,mitigationCreate,mitigationCalibrate,mitigationCheck,mitigationDone,mitigationRestore} from '../src/readout-mitigation.js';
test('asymmetric assignment matrix and inverse give known distributions and a negative estimate',()=>{
 for(const [p,q] of [[0,.1],[.25,.275],[.75,.625],[1,.8]]){assert.ok(Math.abs(mitigationForward(p)-q)<1e-12);assert.ok(Math.abs(mitigationInvert(q)-p)<1e-12);}
 assert.ok(mitigationInvert(mitigationCases.outside.observed/1000)<0);
 assert.throws(()=>mitigationForward(1.1),RangeError);
});
test('calibration, three records and reflection gate completion and restore safely',()=>{
 const q=mitigationCreate();q.zeroError=200;q.oneError=200;assert.equal(mitigationCalibrate(q),false);
 q.zeroError=100;assert.equal(mitigationCalibrate(q),true);
 q.answer='750';assert.equal(mitigationCheck(q),false);
 for(const [id,answer] of [['low','250'],['high','750'],['outside','outside']]){q.selected=id;q.answer=answer;assert.equal(mitigationCheck(q),true);}
 assert.equal(mitigationDone(q),false);q.reflection='distribution';assert.equal(mitigationDone(mitigationRestore(q)),true);
 const copy=mitigationRestore(q);copy.seen.pop();assert.equal(q.seen.length,3);
 assert.throws(()=>mitigationRestore({...q,zeroError:200}),RangeError);
});
