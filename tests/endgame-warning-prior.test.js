import test from 'node:test';import assert from 'node:assert/strict';import {replayWarningPrior} from '../src/endgame-warning-prior.js';
const steps=['numerator:tp','denominator:alarm','next'];
test('same sensor with different prior rates has independently expected counts',()=>{
 const rare=replayWarningPrior('rare',steps),common=replayWarningPrior('common',steps);
 assert.deepEqual(rare.results,[{mode:'rare',fault:10,tp:9,fp:99,alarm:108}]);
 assert.deepEqual(common.results,[{mode:'common',fault:500,tp:450,fp:50,alarm:500}]);
 assert.equal(rare.done,true);assert.equal(common.done,true);
});
test('wrong numerator or denominator, premature results, and post-completion actions fail',()=>{
 for(const [kind,h] of [['rare',['next']],['rare',['numerator:fp']],['rare',['numerator:tp','denominator:fault']],['rare',[...steps,'reset']],['rare',['numerator:tp','next']]])assert.equal(replayWarningPrior(kind,h),null);
 assert.equal(replayWarningPrior('rare',['numerator:tp','reset']).phase,0);
 const h=[...steps,...steps];assert.equal(replayWarningPrior('compare',h).done,false);assert.equal(replayWarningPrior('compare',[...h,'answer:prior']).done,true);assert.equal(replayWarningPrior('compare',[...h,'answer:certain']),null);
});
