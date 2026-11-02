import {test} from 'node:test';
import assert from 'node:assert/strict';
import {scaleSizes,scaleReplay,scaleCreate,scaleStep,scaleComplete,scaleRestore} from '../src/grover-scale.js';

test('independent sine formula agrees with every oracle and diffusion step',()=>{
 for(const n of scaleSizes){const history=[];for(let i=0;i<=8;i++){const r=scaleReplay(n,history),theta=Math.asin(1/Math.sqrt(n)),expected=Math.sin((2*Math.floor(i/2)+1)*theta)**2;assert.ok(Math.abs(r.probability-expected)<1e-12);assert.ok(Math.abs(r.amplitudes.reduce((a,x)=>a+x*x,0)-1)<1e-12);assert.equal(r.queries,Math.ceil(i/2));assert.equal(r.iterations,Math.floor(i/2));assert.equal(r.rounds.length,Math.floor(i/2)+1);if(i<8)history.push(i%2?'diffuse':'oracle');}assert.throws(()=>scaleReplay(n,['diffuse']));}
 const probabilities=n=>scaleReplay(n,['oracle','diffuse','oracle','diffuse','oracle','diffuse','oracle','diffuse']).rounds;
 assert.ok(Math.abs(probabilities(4)[1]-1)<1e-12);assert.ok(Math.abs(probabilities(4)[4]-1)<1e-12);assert.ok(Math.abs(probabilities(8)[2]-.9453125)<1e-12);assert.ok(Math.abs(probabilities(16)[3]-.9613189697265625)<1e-12);
});
test('all three rooms, earliest maxima and a limited interpretation are required',()=>{
 let q=scaleCreate();for(const n of scaleSizes){q.size=n;for(let i=0;i<8;i++){scaleStep(q,i%2?'diffuse':'oracle');q=scaleRestore(q);}q.answers[n]=({4:'1',8:'2',16:'3'})[n];}q.reflection='certain';assert.equal(scaleComplete(q),false);q.reflection='limits';assert.equal(scaleComplete(q),true);const copy=scaleRestore(q);copy.histories[4].pop();assert.equal(scaleComplete(copy),false);assert.equal(scaleComplete(q),true);q.answers[4]='4';assert.equal(scaleComplete(q),false);assert.throws(()=>scaleRestore({...q,histories:{...q.histories,8:['diffuse']}}));
});
