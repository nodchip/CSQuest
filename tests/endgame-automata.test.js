import test from 'node:test';
import assert from 'node:assert/strict';
import {replayAutomata} from '../src/endgame-automata.js';
const even=['set:0:red:1','set:0:blue:0','set:1:red:0','set:1:blue:1'];
const last=['set:0:red:0','set:0:blue:1','set:1:red:0','set:1:blue:1'];
const trials=['test:0','test:1','test:2','test:3'];
test('even machine accepts empty and two red signals but rejects one red',()=>{
 const p=replayAutomata('even',[...even,...trials]);assert.deepEqual(p.tests,{0:true,1:false,2:true,3:true});
 assert.equal(replayAutomata('even',[...even,...trials,'finish']).done,true);
 assert.equal(replayAutomata('even',['test:0']),null);
});
test('last-blue machine and changed transitions invalidate earlier tests',()=>{
 let p=replayAutomata('last',[...last,...trials]);assert.deepEqual(p.tests,{0:false,1:true,2:false,3:true});
 p=replayAutomata('last',[...last,...trials,'set:0:red:1']);assert.deepEqual(p.tests,{});
 assert.equal(replayAutomata('last',[...last,...trials,'finish']).done,true);
});
test('intersection runs both machines and checks empty input and incorrect answers',()=>{
 const h=['step','step','step'];let p=replayAutomata('both',h);assert.equal(p.evenState,0);assert.equal(p.lastState,1);
 assert.equal(replayAutomata('both',[...h,'answer:reject']),null);
 p=replayAutomata('both',[...h,'answer:accept','step','step','answer:reject','answer:reject']);assert.equal(p.done,true);
 assert.equal(replayAutomata('both',['answer:accept']),null);
});
