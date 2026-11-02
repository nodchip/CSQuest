import test from 'node:test';
import assert from 'node:assert/strict';
import {typeApplicationCases,applicationOptions,applicationTrial,applicationBuild,applicationStep,applicationResult,applicationCreate,applicationComplete,applicationRestore} from '../src/type-application.js';

test('application generates the tool equals argument-to-fresh-result constraint',()=>{
 for(const [id,c] of Object.entries(typeApplicationCases)){assert.deepEqual(applicationOptions(id)[0],[c.tool,['fn',c.argument,'b']]);const t=applicationTrial();t.choice=1;assert.equal(applicationBuild(id,t),false);assert.equal(t.solver,null);t.choice=0;assert.ok(applicationBuild(id,t));}
});
test('every legal solving order yields the expected inferred result or finite-type failure',()=>{
 for(const [id,c] of Object.entries(typeApplicationCases)){
  const t=applicationTrial();t.choice=0;applicationBuild(id,t);let terminals=0;
  const walk=x=>{const solver=x.solver;if(solver.phase!=='working'){terminals++;assert.equal(solver.phase,c.expected);if(c.expected==='solved')assert.equal(applicationResult(x),c.result);return;}let advanced=0;for(let i=0;i<solver.equations.length;i++)for(const op of ['bind','decompose','remove','reject']){const n=structuredClone(x);if(applicationStep(n,i,op)){advanced++;walk(n);}}assert.ok(advanced);};walk(t);assert.ok(terminals);
 }
});
test('all four examples, reflection and valid saved choices are necessary',()=>{
 const s=applicationCreate();for(const [id,c] of Object.entries(typeApplicationCases)){const t=s.trials[id];t.choice=0;applicationBuild(id,t);while(t.solver.phase==='working'){let stepped=false;for(let i=0;i<t.solver.equations.length&&!stepped;i++)for(const a of ['bind','decompose','remove','reject'])if(applicationStep(t,i,a)){stepped=true;break;}assert.ok(stepped);}assert.equal(t.solver.phase,c.expected);}s.answer='input-output';s.checked=true;assert.ok(applicationComplete(s));const restored=applicationRestore(s);restored.trials.number.solver.history.pop();assert.notEqual(restored.trials.number.solver.history.length,s.trials.number.solver.history.length);assert.throws(()=>applicationRestore({...s,trials:{...s.trials,number:{choice:1,solver:{history:[],selected:0}}}}));
});
