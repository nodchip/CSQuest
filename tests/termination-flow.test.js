import test from 'node:test';
import assert from 'node:assert/strict';
import {terminationModes,terminationChannels,terminationState,terminationExpected,terminationCreate,terminationReady,terminationCheck,terminationComplete,terminationRestore} from '../src/termination-flow.js';

test('given transition rules return public value or repeat the identical loop state',()=>{
 for(const pub of [0,1]){assert.deepEqual(terminationState('loop',0,pub,1),{state:'done',value:pub});assert.deepEqual(terminationState('loop',1,pub,1),{state:'loop',value:null});assert.deepEqual(terminationState('loop',1,pub,2),{state:'loop',value:null});for(const secret of [0,1])assert.deepEqual(terminationState('finish',secret,pub,1),{state:'done',value:pub});}
 assert.equal(terminationExpected('loop','values'),'not-comparable');assert.equal(terminationExpected('loop','status'),'different');assert.equal(terminationExpected('finish','values'),'same');assert.equal(terminationExpected('finish','status'),'same');assert.throws(()=>terminationState('loop',1,0,3),RangeError);
});
test('step readiness, four comparisons, both audits and reflection are required and saved states validated',()=>{
 const q=terminationCreate();q.answer='not-comparable';assert.equal(terminationReady(q),false);assert.throws(()=>terminationCheck(q),RangeError);q.runs.loop=[1,2];q.runs.finish=[1,1];q.answer='same';terminationCheck(q);assert.equal(q.last.correct,false);
 for(const mode of Object.keys(terminationModes))for(const channel of Object.keys(terminationChannels)){q.mode=mode;q.channel=channel;q.answer=terminationExpected(mode,channel);terminationCheck(q);}
 q.audited=Object.keys(terminationModes);assert.equal(terminationComplete(q),false);q.reflection='termination';assert.equal(terminationComplete(q),true);const copy=terminationRestore(q);copy.runs.loop[1]=0;assert.equal(q.runs.loop[1],2);assert.throws(()=>terminationRestore({...q,runs:{...q.runs,finish:[1,2]}}),RangeError);assert.throws(()=>terminationRestore({...q,last:{...q.last,correct:false}}),RangeError);
});
