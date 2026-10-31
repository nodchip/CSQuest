import test from 'node:test';
import assert from 'node:assert/strict';
import {guardRun,createGuard,restoreGuard,guardComplete} from '../src/aspect-guard.js';
test('proceed executes the withdrawal, including when a mistaken guard allows it',()=>{
 assert.deepEqual(guardRun('allowed','proceed'),{balance:7,executed:true,authorized:true});
 assert.deepEqual(guardRun('denied','proceed'),{balance:7,executed:true,authorized:false});
 assert.deepEqual(guardRun('denied','block'),{balance:10,executed:false,authorized:false});
 assert.deepEqual(guardRun('allowed','block'),{balance:10,executed:false,authorized:true});
 assert.throws(()=>guardRun('unknown','block'));
});
test('both decisions and the explanation are required and restoration copies trials',()=>{
 const s=createGuard();s.trials.allowed='proceed';s.trials.denied='block';s.answer='conditional';assert.equal(guardComplete(s),false);s.checked=true;assert.equal(guardComplete(s),true);
 const restored=restoreGuard(s);restored.trials.denied='proceed';assert.equal(guardComplete(restored),false);assert.equal(guardComplete(s),true);assert.throws(()=>restoreGuard({...s,trials:{allowed:'x',denied:'block'}}));
});
