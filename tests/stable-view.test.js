import test from 'node:test';
import assert from 'node:assert/strict';
import {viewCases,expectedView,buildView,validView,createViews,restoreViews,viewsComplete} from '../src/stable-view.js';
test('new and old mappings provide the same public view, but stale column names fail',()=>{
 assert.deepEqual(buildView('old',{village:'town',amount:'count'}),expectedView);assert.deepEqual(buildView('updated',{village:'place',amount:'deliveries'}),expectedView);assert.deepEqual(buildView('updated',{village:'town',amount:'count'}),[{village:null,amount:null},{village:null,amount:null}]);
 for(const mode of Object.keys(viewCases)){let n=0;const fields=['',...Object.keys(viewCases[mode].fields)];for(const village of fields)for(const amount of fields)if(validView(mode,{mapping:{village,amount},checked:true}))n++;assert.equal(n,1);}
});
test('both cases must be checked and correctly mapped; draft is validated and copied',()=>{
 const s=createViews();s.choices.old={mapping:{village:'town',amount:'count'},checked:true};s.choices.updated={mapping:{village:'place',amount:'deliveries'},checked:true};assert.equal(viewsComplete(s),false);for(const id of Object.keys(s.benefits.answers)){s.benefits.answers[id]={off:'issue',on:'good'};s.benefits.checked[id]={off:true,on:true};}assert.equal(viewsComplete(s),true);const saved=restoreViews(s);s.choices.old.mapping.village='id';assert.equal(viewsComplete(s),false);assert.equal(saved.choices.old.mapping.village,'town');saved.choices.updated.mapping.amount='count';assert.throws(()=>restoreViews(saved),RangeError);
});
