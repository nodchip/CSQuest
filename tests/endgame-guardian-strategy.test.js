import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {replayGuardianStrategy as replay} from '../src/endgame-guardian-strategy.js';
const first=['east:2','west:4','choose:west'],second=['east:3','west:1','choose:east'],horizon=['estimate:east','east:0','west:4','choose:west'];
test('minimax choices and finite depth example',()=>{for(const [kind,actions] of [['first',first],['second',second],['horizon',horizon]]){assert.equal(replay(kind,actions).done,true);assert.equal(replay(kind,[...actions,'reset']),null);}});
test('wrong or out-of-order choices are rejected, history resumes and can reset',()=>{assert.equal(replay('first',['east:8']),null);assert.equal(replay('first',['west:4']),null);assert.equal(replay('horizon',['estimate:west']),null);assert.equal(replay('horizon',['estimate:east','east:9']),null);assert.equal(replay('horizon',horizon.slice(0,2)).step,2);assert.equal(replay('horizon',[...horizon.slice(0,2),'reset']).step,0);});
