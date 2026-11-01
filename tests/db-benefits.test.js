import test from 'node:test';
import assert from 'node:assert/strict';
import {benefitCases,createDbBenefits,benefitCorrect,benefitsComplete,restoreDbBenefits} from '../src/db-benefits.js';
import {createViews,restoreViews} from '../src/stable-view.js';

test('all four protections require both predicted outcomes and checked evidence',()=>{
 const s=createDbBenefits();
 for(const id of Object.keys(benefitCases))for(const mode of ['off','on']){
  s.answers[id][mode]=mode==='on'?'issue':'good';s.checked[id][mode]=true;assert.equal(benefitCorrect(s,id,mode),false);
  s.answers[id][mode]=mode==='on'?'good':'issue';assert.equal(benefitCorrect(s,id,mode),true);
 }
 assert.equal(benefitsComplete(s),true);
 const copy=restoreDbBenefits(s);copy.answers.unique.on='issue';assert.equal(s.answers.unique.on,'good');
 assert.throws(()=>restoreDbBenefits({...s,answers:{...s.answers,unique:{off:null,on:'good'}}}));
});
test('earlier drafts preserve view selections and acquire fresh comparisons',()=>{
 const {benefits,...old}=createViews();old.choices.old.mapping.village='town';
 const r=restoreViews(old);assert.equal(r.choices.old.mapping.village,'town');assert.deepEqual(r.benefits,createDbBenefits());
});
