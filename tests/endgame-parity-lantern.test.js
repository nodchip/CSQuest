import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {replayParityLantern as replay} from '../src/endgame-parity-lantern.js';
test('even parity creation and every single and double flip in fixed word',()=>{
 assert.deepEqual(replay('make',['flip:4','check']).bits,[1,1,1,1]);
 for(let i=1;i<=4;i++){const s=replay('single',[`flip:${i}`,'check','answer:detected']);assert.equal(s.odd,true);assert.equal(s.done,true);for(let j=i+1;j<=4;j++){const d=replay('double',[`flip:${i}`,`flip:${j}`,'check','answer:undetected']);assert.equal(d.odd,false);assert.equal(d.done,true);}}
});
test('incorrect, premature, excessive and post-completion actions are rejected; history and reset',()=>{
 assert.equal(replay('make',['check']),null);assert.equal(replay('make',['flip:1']),null);assert.equal(replay('single',['check']),null);assert.equal(replay('double',['flip:1','check']),null);assert.equal(replay('single',['flip:1','check','answer:undetected']),null);assert.equal(replay('single',['flip:1','check','flip:2']),null);assert.equal(replay('single',['flip:1','check','answer:detected','reset']),null);assert.deepEqual(replay('double',['flip:2','reset']).bits,[1,0,1,0]);
});
