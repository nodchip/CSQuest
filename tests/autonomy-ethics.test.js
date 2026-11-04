import test from 'node:test';
import assert from 'node:assert/strict';
import {autonomyCards,autonomyCreate,autonomyOpen,autonomyCheck,autonomyDone,autonomyRestore} from '../src/autonomy-ethics.js';
test('source position and two levels of human control remain distinct',()=>{let q=autonomyCreate();q.choice='human';assert.equal(autonomyCheck(q),null);for(const [id,card] of Object.entries(autonomyCards)){autonomyOpen(q,id);q.choice=card.answer==='human'?'machine':'human';assert.equal(autonomyCheck(q),false);q.choice=card.answer;assert.equal(autonomyCheck(q),true);q=autonomyRestore(q);}assert.equal(autonomyDone(q),false);q.reflection='position';assert.equal(autonomyDone(autonomyRestore(q)),true);assert.throws(()=>autonomyRestore({...q,opened:[],matched:['remote']}),RangeError);});
