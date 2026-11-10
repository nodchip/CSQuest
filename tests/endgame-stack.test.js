import test from 'node:test';
import assert from 'node:assert/strict';
import {stackPop,replayStack} from '../src/endgame-stack.js';
test('empty peek and pop preserve the stack, and equal labels remain separate cards',()=>{
 assert.deepEqual(stackPop([]),{value:null,rest:[]});assert.deepEqual(stackPop(['A','A']),{value:'A',rest:['A']});
 const first=['peek','pop','push:A','push:B'];const before=replayStack('stack',first);const peeked=replayStack('stack',[...first,'peek']);assert.deepEqual(peeked.stack,before.stack);
 assert.equal(replayStack('stack',['push:A']),null);const two=[...first,'peek','pop','push:A'];assert.deepEqual(replayStack('stack',JSON.parse(JSON.stringify(two))).stack,['A','A']);
 const done=[...two,'pop','pop','pop','check'],r=replayStack('stack',done);assert.equal(r.done,true);assert.deepEqual(r.stack,[]);assert.deepEqual(r.removed,[null,'B','A','A',null]);assert.equal(replayStack('stack',[...done,'pop']),null);
});
test('same inserted cards produce LIFO versus FIFO removal order',()=>{
 const actions=['take:stack','take:queue','take:stack','take:queue','take:stack','take:queue','check'],r=replayStack('compare',actions);
 assert.equal(r.done,true);assert.deepEqual(r.removed,['C','A','B','B','A','C']);assert.deepEqual(r.stack,[]);assert.deepEqual(r.queue,[]);
});
test('undo restores each prior document; empty history has no effect',()=>{
 const prefix=['add:月','add:星','undo','add:風'];assert.equal(replayStack('undo',prefix).doc,'月風');assert.deepEqual(replayStack('undo',prefix).undoStack,['','月']);
 const r=replayStack('undo',[...prefix,'undo','undo','undo','check']);assert.equal(r.done,true);assert.equal(r.doc,'');assert.deepEqual(r.undoStack,[]);
 assert.equal(replayStack('undo',['add:月','undo']),null);assert.equal(replayStack('undo',['add:月','reset']).doc,'');
});
