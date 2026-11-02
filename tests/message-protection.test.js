import test from 'node:test';
import assert from 'node:assert/strict';
import {messageControls,messageThreats,messageOutcome,messageProtectionCreate,messageProtectionComplete,messageProtectionRestore} from '../src/message-protection.js';

test('all 16 control sets expose the prerequisites of the four fixed attacks',()=>{
 const keys=Object.keys(messageControls);
 for(let mask=0;mask<16;mask++){const controls=keys.filter((_,i)=>mask&(1<<i));const [enc,tag,id,auth]=keys.map(k=>controls.includes(k));assert.equal(messageOutcome('observe',controls),enc);assert.equal(messageOutcome('modify',controls),tag&&id);assert.equal(messageOutcome('fake',controls),id);assert.equal(messageOutcome('role',controls),id&&auth);}
});
test('both outcomes for each attack, all controls and a reflection are required; drafts are copied',()=>{
 const s=messageProtectionCreate();s.controls=Object.keys(messageControls);for(const id of Object.keys(messageThreats))s.observed[id]={blocked:true,exposed:true};assert.equal(messageProtectionComplete(s),false);s.reflection='limits';assert.equal(messageProtectionComplete(s),true);const copy=messageProtectionRestore(s);copy.observed.role.blocked=false;assert.equal(messageProtectionComplete(copy),false);assert.equal(messageProtectionComplete(s),true);copy.controls.push('encrypt');assert.throws(()=>messageProtectionRestore(copy));
});
