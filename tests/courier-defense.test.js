import test from 'node:test';
import assert from 'node:assert/strict';
import {courierThreats,courierOutcome,createCourierDefense,courierChoose,courierRestart,courierDefenseComplete,restoreCourierDefense} from '../src/courier-defense.js';
test('all 32 journeys follow the threat-specific protections',()=>{
 for(const threat of Object.keys(courierThreats))for(const key of ['checked','unchecked'])for(const seal of ['aead','plain'])for(const gate of ['sequence','none']){
  const r=courierOutcome(threat,key,seal,gate);
  const expected=threat==='spy'||threat==='tamper'?seal==='aead':threat==='swap'?key==='checked'&&seal==='aead':gate==='sequence'&&seal==='aead';
  assert.equal(r.safe,expected,`${threat}/${key}/${seal}/${gate}`);
 }
});
test('stage transitions, retries and restoration preserve completed scenarios',()=>{
 let s=createCourierDefense();assert.throws(()=>courierChoose(s,'aead'));
 s=courierChoose(s,'unchecked');s=courierChoose(s,'plain');s=courierChoose(s,'none');assert.equal(s.stage,'result');assert.deepEqual(s.observed,[]);
 for(const threat of Object.keys(courierThreats)){s=courierRestart(s,threat);s=courierChoose(s,'checked');s=restoreCourierDefense(s);s=courierChoose(s,'aead');s=courierChoose(s,'sequence');assert.ok(s.observed.includes(threat));}
 s.answer='layers';s.checked=true;assert.ok(courierDefenseComplete(restoreCourierDefense(s)));
 assert.throws(()=>restoreCourierDefense({...s,stage:'key'}));assert.throws(()=>restoreCourierDefense({...s,observed:['spy','spy']}));
});
