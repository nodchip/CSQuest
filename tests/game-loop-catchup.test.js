import test from 'node:test';
import assert from 'node:assert/strict';
import {catchupIntervals,catchupMeasure} from '../src/game-loop-catchup.js';
import {loopTimeCreate,loopTimeRestore} from '../src/game-loop-time.js';

test('bounded fixed updates keep unprocessed time and can fall behind',()=>{
 assert.equal(catchupIntervals.reduce((a,b)=>a+b,0),1000);
 const one=Array.from({length:7},(_,i)=>catchupMeasure('one',i));
 const three=Array.from({length:7},(_,i)=>catchupMeasure('three',i));
 assert.deepEqual(one.map(s=>s.updates),[0,1,2,3,4,5,6]);
 assert.deepEqual(three.map(s=>s.updates),[0,1,2,5,6,7,10]);
 assert.deepEqual([one.at(-1).position,one.at(-1).backlog],[36,400]);
 assert.deepEqual([three.at(-1).position,three.at(-1).backlog],[60,0]);
 const dropped=Array.from({length:7},(_,i)=>catchupMeasure('drop',i));
 assert.deepEqual([dropped.at(-1).position,dropped.at(-1).backlog,dropped.at(-1).discarded],[36,0,400]);
 assert.deepEqual([dropped[3].backlog,dropped[3].discarded],[50,200]);
 for(const s of [...one,...three,...dropped])assert.equal(s.elapsed,s.updates*100+s.backlog+s.discarded);
 assert.throws(()=>catchupMeasure('one',7));assert.throws(()=>catchupMeasure('invalid',0));
});
test('old drafts restore and separate catch-up progress is validated',()=>{
 const old=loopTimeCreate();delete old.catchupMode;delete old.catchupFrames;delete old.catchupAnswer;delete old.catchupChecked;
 const restored=loopTimeRestore(old);assert.deepEqual(restored.catchupFrames,{one:0,three:0,drop:0});
 const q=loopTimeRestore({...old,catchupMode:'three',catchupFrames:{one:6,three:3},catchupAnswer:'lag',catchupChecked:true});
 assert.deepEqual(q.catchupFrames,{one:6,three:3,drop:0});assert.equal(q.catchupChecked,true);
 assert.equal(loopTimeRestore({...old,catchupFrames:{one:6,three:6,drop:6},discardAnswer:'discard',discardChecked:true}).discardChecked,true);
 assert.throws(()=>loopTimeRestore({...old,catchupFrames:{one:0,three:0,drop:null}}));
 assert.throws(()=>loopTimeRestore({...old,discardChecked:true}));
 assert.throws(()=>loopTimeRestore({...old,catchupFrames:{one:7,three:0}}));
 assert.throws(()=>loopTimeRestore({...old,catchupChecked:true}));
});
