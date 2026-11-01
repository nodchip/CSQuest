import test from 'node:test';
import assert from 'node:assert/strict';
import {localizationObserve,localizationMove,createLocalizationTrial,localizationStep,createLocalization,localizationComplete,restoreLocalization} from '../src/robot-localization.js';

test('observation and transition agree with independently enumerated integer mass',()=>{
 for(let a=0;a<=5;a++)for(let b=0;b<=5;b++)for(let c=0;c<=5;c++){if(a+b+c===0)continue;const source=[a,b,c];for(const color of ['red','blue']){const likelihood=color==='red'?[3,1,3]:[1,3,1],expected=source.map((w,i)=>w*likelihood[i]),actual=localizationObserve(source,color);for(let i=0;i<3;i++)for(let j=0;j<3;j++)assert.equal(actual[i]*expected[j],actual[j]*expected[i]);}for(let p=0;p<=4;p++){const expected=[a*(4-p),b*(4-p)+a*p,c*4+b*p],actual=localizationMove(source,p);for(let i=0;i<3;i++)for(let j=0;j<3;j++)assert.equal(actual[i]*expected[j],actual[j]*expected[i]);}}
});
test('two movement models update to the expected distributions and reject incorrect histories',()=>{
 assert.deepEqual(localizationObserve([1,1,1],'red'),[3,1,3]);assert.deepEqual(localizationMove([3,1,3],4),[0,3,4]);assert.deepEqual(localizationMove([3,1,3],3),[3,10,15]);assert.deepEqual(localizationObserve([0,3,4],'blue'),[0,9,4]);assert.deepEqual(localizationObserve([3,10,15],'blue'),[1,10,5]);
 const histories={perfect:['red','guess:3,1,3','move','guess:0,3,4','blue','guess:0,9,4'],slip:['red','guess:3,1,3','move','guess:3,10,15','blue','guess:1,10,5']};for(const [mode,actions] of Object.entries(histories)){let t=createLocalizationTrial(mode);for(const a of actions)t=localizationStep(t,a);assert.equal(t.history.length,6);assert.throws(()=>localizationStep(t,'red'));}
 const r=restoreLocalization({selected:'slip',histories,answer:'belief',checked:true});assert.equal(localizationComplete(r),true);assert.equal(localizationComplete(createLocalization()),false);assert.throws(()=>restoreLocalization({selected:'slip',histories:{...histories,slip:['red','guess:1,1,1']},answer:null,checked:false}));
});
