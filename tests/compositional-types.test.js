import test from 'node:test';
import assert from 'node:assert/strict';
import {ruleParts,ruleExamples,ruleType,ruleDerivation,ruleCreate,ruleCorrect,ruleRestore} from '../src/compositional-types.js';
import {proofCreate,proofRestore} from '../src/type-safety-proof.js';
test('the chosen local rules determine types bottom-up, including nested failures',()=>{const r={number:'number',light:'light',plus:'number',branch:'light'};assert.deepEqual(Object.values(ruleExamples).map(e=>ruleType(e.term,r)),['number','light','number','error','number','error']);assert.equal(ruleType(ruleExamples.nested.term,{...r,plus:'light'}),'error');assert.equal(ruleType(ruleExamples.badPlus.term,{...r,plus:'light'}),'light');assert.equal(ruleType(ruleExamples.branch.term,{...r,branch:'number'}),'error');assert.equal(ruleType(ruleExamples.different.term,{...r,light:'number',branch:'number'}),'number');});
test('only the intended four rules pass and old proofs gain an independent lab',()=>{for(let mask=0;mask<16;mask++){const r=Object.fromEntries(Object.keys(ruleParts).map((k,i)=>[k,mask&(1<<i)?'light':'number']));assert.equal(ruleCorrect(r),mask===10);}const old=proofCreate();delete old.rulesLab;assert.deepEqual(proofRestore(old).rulesLab,ruleCreate());const s=ruleCreate();s.seen.push('number');const copy=ruleRestore(s);copy.seen.pop();assert.equal(s.seen.length,1);assert.throws(()=>ruleRestore({...s,seen:['wrong']}));});

test('derivations explain each local premise in child-first order',()=>{
 const r={number:'number',light:'light',plus:'number',branch:'light'};
 const nested=ruleDerivation(ruleExamples.nested.term,r);
 assert.deepEqual(nested.steps.map(s=>s.result),['number','number','number']);
 assert.deepEqual(nested.steps.map(s=>s.path),['式全体の中身の中身','式全体の中身','式全体']);
 const bad=ruleDerivation(ruleExamples.badPlus.term,r);assert.deepEqual(bad.steps.map(s=>s.result),['light','error']);assert.match(bad.steps[1].reason,/灯り型.*数型/);
 const different=ruleDerivation(ruleExamples.different.term,r);assert.equal(different.result,'error');assert.match(different.steps.at(-1).reason,/道の型.*異なる/);
 const changed=ruleDerivation(ruleExamples.branch.term,{...r,branch:'number'});assert.match(changed.steps.at(-1).reason,/条件は灯り型.*数型/);
 const inner=ruleDerivation(['plus',['plus',['light']]],r);assert.equal(inner.result,'error');assert.match(inner.steps.at(-1).reason,/中身に型が付かない/);
 const child=ruleDerivation(['branch',['light'],['plus',['light']],['number']],r);assert.match(child.steps.at(-1).reason,/型が付かない部分式/);
});
test('each example result matches an independent type checker for all rule settings',()=>{
 function expected([kind,...child],r){if(kind==='number'||kind==='light')return r[kind];if(kind==='plus'){const value=expected(child[0],r);return value===r.plus?value:'error';}const [c,a,b]=child.map(x=>expected(x,r));return c===r.branch&&a!=='error'&&a===b?a:'error';}
 for(let mask=0;mask<16;mask++){const r=Object.fromEntries(Object.keys(ruleParts).map((k,i)=>[k,mask&(1<<i)?'light':'number']));for(const {term} of Object.values(ruleExamples)){const d=ruleDerivation(term,r);assert.equal(d.result,expected(term,r));assert.equal(d.steps.at(-1).result,d.result);assert.ok(d.steps.every(x=>x.reason&&x.path));}}
});
