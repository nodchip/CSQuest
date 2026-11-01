import test from 'node:test';
import assert from 'node:assert/strict';
import {fixedPointCases,fixedPointEncode,fixedPointRead,createFixedPoint,fixedPointComplete,restoreFixedPoint} from '../src/fixed-point.js';

test('every eight-bit pattern agrees with signed and unsigned DataView readings',()=>{
 const view=new DataView(new ArrayBuffer(1));for(let byte=0;byte<256;byte++){view.setUint8(0,byte);const r=fixedPointRead(byte);assert.equal(r.signed,view.getInt8(0)/16);assert.equal(r.unsigned,view.getUint8(0)/16);assert.equal(parseInt(r.bits,2),byte);}
});
test('halfway rounds to even before range check, including negative boundaries',()=>{
 const expected={ordinary:[21,false,true],negative:[-21,false,true],tieZero:[0,true,true],tieTwo:[2,true,true],upper:[128,true,false],lowerTie:[-128,true,true],lowerOverflow:[-130,true,false]};
 for(const key of Object.keys(fixedPointCases)){const r=fixedPointEncode(key),[integer,tie,inRange]=expected[key];assert.deepEqual([r.integer,r.tie,r.inRange],[integer,tie,inRange]);if(inRange){assert.equal(fixedPointRead(r.byte).signed,integer/16);assert.equal(r.error,r.value-r.input);}else{assert.equal(r.byte,null);assert.equal(r.value,null);}}
});
test('required conversions, bit patterns and reflection survive restore',()=>{
 const s=createFixedPoint();s.observed=['ordinary','tieZero','tieTwo','upper','lowerTie','lowerOverflow'];s.inspected=[127,128];s.answer='rounded';s.checked=true;const copy=restoreFixedPoint(s);assert.equal(fixedPointComplete(copy),true);copy.inspected.pop();assert.equal(s.inspected.length,2);assert.equal(fixedPointComplete(copy),false);assert.throws(()=>restoreFixedPoint({...s,inspected:[127,127]}));
});
