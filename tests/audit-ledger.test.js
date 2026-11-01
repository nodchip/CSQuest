import test from 'node:test';
import assert from 'node:assert/strict';
import {auditEvents,auditFields,createAudit,auditFieldsCorrect,auditCaseCorrect,auditComplete,restoreAudit,auditProtectionCases,auditProtectionChoices,auditProtectionResult,auditProtectionComplete} from '../src/audit-ledger.js';
test('expected records match the independently stated filters',()=>{assert.deepEqual(auditEvents.filter(e=>e.outcome==='denied').map(e=>e.id),['E2']);assert.deepEqual(auditEvents.filter(e=>e.outcome==='allowed'&&e.count>10).map(e=>e.id),['E3']);});
test('metadata, both reviews, and restrained conclusions are required',()=>{const s=createAudit();for(const id of Object.keys(auditFields))s.fields[id]=id!=='content';s.fieldsChecked=true;s.cases.denied={events:['E2'],reason:'limited',checked:true};s.cases.bulk={events:['E3'],reason:'review',checked:true};for(const id of Object.keys(auditProtectionCases))s.protection[id]={observed:true,answer:auditProtectionResult(id),checked:true};assert.equal(auditFieldsCorrect(s),true);assert.equal(auditCaseCorrect(s,'denied'),true);assert.equal(auditComplete(restoreAudit(s)),true);s.fields.content=true;assert.equal(auditComplete(s),false);s.fields.content=false;s.cases.bulk.reason='guilty';assert.equal(auditComplete(s),false);assert.throws(()=>restoreAudit({...s,cases:{...s.cases,denied:{...s.cases.denied,events:['E2','E2']}}}));});

test('separate storage retains only records already delivered and all comparisons are required',()=>{
 assert.equal(auditProtectionResult('shared'),'neither');assert.equal(auditProtectionResult('separate'),'copy');assert.equal(auditProtectionResult('missing'),'neither');
 const s=createAudit(),old={...s};delete old.protection;assert.equal(auditProtectionComplete(restoreAudit(old)),false);
 for(const id of Object.keys(auditProtectionCases))s.protection[id]={observed:true,answer:auditProtectionResult(id),checked:true};
 assert.equal(auditProtectionComplete(s),true);
 for(const id of Object.keys(auditProtectionCases))for(const answer of Object.keys(auditProtectionChoices)){const copy=restoreAudit(s);copy.protection[id].answer=answer;assert.equal(auditProtectionComplete(copy),answer===auditProtectionResult(id));}
 const copy=restoreAudit(s);copy.protection.separate.observed=false;assert.equal(auditProtectionComplete(copy),false);assert.equal(auditProtectionComplete(s),true);
 assert.throws(()=>restoreAudit({...s,protection:{...s.protection,missing:{observed:true,checked:true,answer:'invalid'}}}));
});
