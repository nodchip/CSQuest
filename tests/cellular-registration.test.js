import test from 'node:test';
import assert from 'node:assert/strict';
import {createCellularTrial,cellularStep,createCellular,cellularComplete,restoreCellular} from '../src/cellular-registration.js';
test('initial registration and a stale record after moving affect paging',()=>{
 const s=createCellular();let join=s.trials.join;join=cellularStep('join',join,'page');assert.equal(join.delivered,false);assert.equal(cellularStep('join',join,'register').registered,null);for(const a of ['detect','register','page'])join=cellularStep('join',join,a);assert.equal(join.delivered,true);s.trials.join=join;
 let move=s.trials.move;move=cellularStep('move',move,'move');assert.equal(move.registered,'north');assert.equal(move.area,'south');move=cellularStep('move',move,'page');assert.equal(move.delivered,false);assert.equal(move.missed,true);for(const a of ['detect','register','page'])move=cellularStep('move',move,a);assert.equal(move.registered,'south');assert.equal(move.delivered,true);s.trials.move=move;assert.equal(cellularComplete(s),false);let prompt=s.trials.prompt;for(const a of ['move','detect','register','page'])prompt=cellularStep('prompt',prompt,a);assert.equal(prompt.delivered,true);assert.equal(prompt.missed,false);s.trials.prompt=prompt;assert.equal(cellularComplete(s),true);assert.deepEqual(restoreCellular(s),s);
});
test('movement invalidates old detection and saved histories are replayed',()=>{
 let t=createCellularTrial('move');t=cellularStep('move',t,'detect');t=cellularStep('move',t,'move');assert.equal(t.detected,false);assert.equal(cellularStep('move',t,'register').registered,'north');const s=createCellular();s.trials.move=t;const copy=restoreCellular(s);copy.trials.move.history.push('register');assert.throws(()=>restoreCellular(copy));assert.equal(s.trials.move.history.length,2);
});

test('legacy drafts retain their progress and add an unstarted prompt update',()=>{
 const old=createCellular();old.trials.move=cellularStep('move',old.trials.move,'move');delete old.trials.prompt;const restored=restoreCellular(old);assert.equal(restored.trials.move.area,'south');assert.deepEqual(restored.trials.prompt,createCellularTrial('prompt'));assert.equal(cellularComplete(restored),false);
});
