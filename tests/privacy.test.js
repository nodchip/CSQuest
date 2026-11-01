import test from 'node:test';
import assert from 'node:assert/strict';
import {createPrivacy,toggleField,toggleGrant,assessPrivacy,restorePrivacy,identityCases,identityChoices,identityComplete} from '../src/privacy.js';
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

test('all identity answers must be correct and checked; legacy drafts migrate',()=>{
 const s=intended(); const old={...s};delete old.identity;
 assert.equal(identityComplete(restorePrivacy(old)),false);
 for(const [id,c] of Object.entries(identityCases)){s.identity.answers[id]=c.answer;s.identity.checked[id]=true;}
 assert.equal(identityComplete(s),true);
 for(const id of Object.keys(identityCases))for(const choice of Object.keys(identityChoices)){
  const t=restorePrivacy(s);t.identity.answers[id]=choice;
  assert.equal(identityComplete(t),choice===identityCases[id].answer);
 }
 const restored=restorePrivacy(s);restored.identity.checked.named=false;
 assert.equal(identityComplete(restored),false);assert.equal(identityComplete(s),true);
 assert.throws(()=>restorePrivacy({...s,identity:{...s.identity,answers:{...s.identity.answers,named:'invalid'}}}));
});
