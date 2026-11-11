import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {replayDmaGems as replay,advanceDmaGems as advance} from '../src/endgame-dma-gems.js';
const cpu=[...Array(4).fill('do:copy'),...Array(3).fill('do:work')],dma=['do:setup',...Array(3).fill('do:work'),'do:wait','do:finish'];
test('independent fixed-schedule timing and completion',()=>{const a=replay('cpu',cpu).trial,b=replay('dma',dma).trial;assert.deepEqual([a.time,a.transferred,a.work],[7,4,3]);assert.deepEqual([b.time,b.transferred,b.work,b.serviced],[6,4,3,true]);assert.ok(replay('cpu',[...cpu,'check']).done);assert.ok(replay('dma',[...dma,'check']).done);});
test('reject premature completion, disabled waiting, invalid actions, reset and resume',()=>{assert.equal(replay('dma',['do:wait']),null);assert.equal(replay('dma',['do:setup','do:finish']),null);assert.equal(replay('cpu',['do:setup']),null);assert.equal(replay('dma',[...dma,'check','do:wait']),null);let h=[];for(let i=0;i<30;i++){h=advance('dma',h,'do:setup');h=advance('dma',h,'reset');assert.deepEqual(h,[]);}h=advance('dma',h,'do:setup');assert.equal(replay('dma',JSON.parse(JSON.stringify(h))).trial.started,true);});
