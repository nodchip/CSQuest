import test from 'node:test';
import assert from 'node:assert/strict';
import {createPrivacy,toggleField,toggleGrant,assessPrivacy,restorePrivacy} from '../src/privacy.js';
function intended(){let s=createPrivacy();for(const id of ['name','address'])s=toggleField(s,id);for(const [r,id] of [['preparer','slot'],['clerk','herb'],['public','token'],['public','herb'],['public','slot']])s=toggleGrant(s,r,id);return s;}
test('minimum fields and audience access support the specified tasks',()=>{const s=intended();assert.deepEqual(assessPrivacy(s),[]);assert.deepEqual(assessPrivacy(restorePrivacy(s)),[]);});
test('missing information and unnecessary audience access are detected independently',()=>{
  let s=intended();s=toggleField(s,'token');assert.ok(assessPrivacy(s).some(x=>x.includes('受取番号 がない')));
  s=intended();s=toggleGrant(s,'public','token');assert.ok(assessPrivacy(s).some(x=>x.includes('掲示板 に 受取番号')));
  s=intended();s=toggleGrant(s,'clerk','slot');assert.ok(assessPrivacy(s).some(x=>x.includes('受付 は仕事')));
});
test('removing a field clears grants and malformed saved policy is rejected',()=>{
  const s=toggleField(createPrivacy(),'name');assert.equal(s.grants.public.name,false);assert.throws(()=>toggleGrant(s,'public','name'),RangeError);
  assert.throws(()=>restorePrivacy({...s,grants:{...s.grants,public:{...s.grants.public,name:true}}}),RangeError);
});
