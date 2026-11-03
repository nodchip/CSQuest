import test from 'node:test';
import assert from 'node:assert/strict';
import {polynomialSamples,polynomialLambdas,polynomialFit,polynomialCreate,polynomialRestore,polynomialDone,polynomialRequirements} from '../src/polynomial-map.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
test('fit solves the penalized normal equations and independently computed errors',()=>{
 for(const id of Object.keys(polynomialSamples))for(const lambda of polynomialLambdas){
  const f=polynomialFit(id,lambda),{train,test}=polynomialSamples[id];let gradientA=0,gradientB=lambda*f.b,trainError=0,testError=0;
  for(const [x,y] of train){const e=f.a+f.b*x*x-y;gradientA+=e;gradientB+=x*x*e;trainError+=e*e;}
  for(const [x,y] of test)testError+=(f.a+f.b*x*x-y)**2;
  near(gradientA,0);near(gradientB,0);near(f.trainError,trainError);near(f.testError,testError);near(f.objective,trainError+lambda*f.b*f.b);
 }
 const n=polynomialFit('noisy',8);near(n.a,.8);near(n.b,1);near(n.testError,.08);const clean=polynomialFit('clean',0);near(clean.a,1);near(clean.b,1);near(clean.testError,0);
 assert.ok(polynomialFit('noisy',8).testError<polynomialFit('noisy',0).testError);assert.ok(polynomialFit('clean',0).testError<polynomialFit('clean',8).testError);
});
test('required experiments and both interpretations gate completion; restoration copies history',()=>{
 const q=polynomialCreate();q.seen=[...polynomialRequirements];q.reflection='context';q.prior='coefficient';assert.equal(polynomialDone(q),true);const copy=polynomialRestore(q);copy.seen.pop();assert.equal(q.seen.length,6);assert.throws(()=>polynomialRestore({...q,lambda:-1}));assert.throws(()=>polynomialRestore({...q,seen:['noisy:0','noisy:0']}));
});
