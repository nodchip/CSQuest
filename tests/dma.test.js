import test from 'node:test';
import assert from 'node:assert/strict';
import {createDmaTrial,dmaDone,dmaStep,createDma,dmaComplete,restoreDma} from '../src/dma.js';
test('DMA transfers during other work but not on its setup tick, and requires service',()=>{
 let s=createDmaTrial('dma');s=dmaStep(s,'setup');assert.equal(s.transferred,0);s=dmaStep(s,'work');assert.equal(s.transferred,1);assert.equal(s.work,1);const rejected=dmaStep(s,'finish');assert.equal(rejected.history.length,2);for(const a of ['work','work','wait','finish'])s=dmaStep(s,a);assert.equal(s.time,6);assert.equal(dmaDone(s),true);
});
test('independent breadth-first exploration finds minima 7 and 6 and restores both trials',()=>{
 const actions=['copy','setup','work','wait','finish'];for(const [mode,min] of [['cpu',7],['dma',6]]){const queue=[createDmaTrial(mode)],seen=new Set();let shortest;while(queue.length){const s=queue.shift(),key=[s.transferred,s.work,s.started,s.serviced].join(',');if(seen.has(key))continue;seen.add(key);if(dmaDone(s)){shortest=s.time;break;}for(const a of actions){const next=dmaStep(s,a);if(next.history.length>s.history.length)queue.push(next);}}assert.equal(shortest,min);}
 const states=createDma();for(const a of ['copy','copy','copy','copy','work','work','work'])states.trials.cpu=dmaStep(states.trials.cpu,a);for(const a of ['setup','work','work','work','wait','finish'])states.trials.dma=dmaStep(states.trials.dma,a);assert.equal(dmaComplete(states),true);const r=restoreDma({selected:'dma',histories:{cpu:states.trials.cpu.history,dma:states.trials.dma.history}});assert.equal(dmaComplete(r),true);assert.throws(()=>restoreDma({selected:'dma',histories:{cpu:[],dma:['finish']}}),RangeError);
});
