import test from 'node:test';
import assert from 'node:assert/strict';
import {compilerCases,createCompilerTrial,compilerStep,createCompiler,compilerComplete,restoreCompiler} from '../src/compiler-stages.js';
test('syntax and type errors are detected at distinct stages and require a full recheck',()=>{
 const s=createCompiler();for(const [id,c] of Object.entries(compilerCases)){let t=createCompilerTrial();assert.equal(compilerStep(id,t,'emit',null).phase,'scan');t=compilerStep(id,t,'scan',null);t=compilerStep(id,t,'parse',null);if(c.issue==='type'){assert.equal(t.phase,'type');t=compilerStep(id,t,'type',null);}assert.equal(t.phase,'error');assert.equal(compilerStep(id,t,'repair',c.issue==='type'?'syntax':'type').phase,'error');t=compilerStep(id,t,'repair',c.issue);assert.equal(t.phase,'scan');for(const action of ['scan','parse','type','emit'])t=compilerStep(id,t,action,c.issue);assert.equal(t.phase,'done');assert.equal(t.repaired,true);s.trials[id]=t;}assert.equal(compilerComplete(s),true);assert.deepEqual(restoreCompiler(s),s);
});
test('saved history is replayed and rejects impossible transitions',()=>{
 const s=createCompiler();s.trials.syntax=compilerStep('syntax',s.trials.syntax,'scan',null);const copy=restoreCompiler(s);copy.trials.syntax.history.push(['emit',null]);assert.throws(()=>restoreCompiler(copy));assert.equal(s.trials.syntax.history.length,1);
});
