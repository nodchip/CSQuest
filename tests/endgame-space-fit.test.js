import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {replaySpaceFit as replay} from '../src/endgame-space-fit.js';
const first=['first:allocate4:4','first:allocate6:none','first:free4','first:allocate6:4'],best=['best:allocate4:11','best:allocate6:4'];
test('first fit fragments six boxes, best fit leaves a six-box run, recovery coalesces',()=>{
 const blocked=replay('first',first.slice(0,2)).trials.first;assert.equal(blocked.stage,'blocked');assert.equal(blocked.cells.filter(x=>x==='.').length,9);assert.deepEqual(blocked.cells.slice(4,10),['A','A','A','A','.','.']);
 const a=replay('first',[...first,'check']);assert.equal(a.trials.first.stage,'done');assert.deepEqual(a.trials.first.cells.slice(4,10),Array(6).fill('B'));assert.equal(a.done,true);
 const b=replay('best',[...best,'check']);assert.equal(b.trials.best.stage,'done');assert.deepEqual(b.trials.best.cells.slice(11,15),Array(4).fill('A'));
 assert.equal(replay('compare',[...first,...best,'answer:fragment']).done,true);
});
test('reject incorrect choice and premature answers, and replay reset',()=>{
 assert.equal(replay('first',['first:allocate4:11']),null);assert.equal(replay('best',['best:allocate4:4']),null);assert.equal(replay('first',[first[0],'first:allocate6:4']),null);assert.equal(replay('first',[first[0],'first:allocate6:11']),null);assert.equal(replay('best',[best[0],'best:allocate6:none']),null);assert.equal(replay('first',['check']),null);assert.equal(replay('compare',[...first,'answer:fragment']),null);assert.equal(replay('best',[...best,'check','reset']),null);assert.equal(replay('first',[first[0],'reset']).trials.first.stage,'first');
});
