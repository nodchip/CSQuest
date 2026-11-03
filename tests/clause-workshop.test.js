import test from 'node:test';
import assert from 'node:assert/strict';
import {clauseInitial,clauseNodes,clauseRewrite,clauseTruth,clauseCnf,clauseReplay,clauseCreate,clauseRestore,clauseDone,clauseRules} from '../src/clause-workshop.js';
const histories=[[{path:'',rule:'imp'},{path:'L',rule:'demorgan'},{path:'',rule:'distribute'}],[{path:'',rule:'imp'},{path:'',rule:'distribute'}],[{path:'N',rule:'imp'},{path:'',rule:'demorgan'},{path:'L',rule:'double'}]];
test('three transformations reach CNF and preserve all eight assignments',()=>{
 for(let task=0;task<3;task++){let e=clauseInitial(task);const original=clauseTruth(e);assert.equal(clauseCnf(e),false);for(const step of histories[task]){e=clauseRewrite(e,step.path,step.rule);assert.deepEqual(clauseTruth(e),original);}assert.equal(clauseCnf(e),true);assert.deepEqual(clauseReplay(task,histories[task]),e);}
});
test('every available rewrite along the examples preserves an independent evaluator',()=>{
 const evalIndependent=(e,env)=>e.op==='var'?env[e.name]:e.op==='not'?!evalIndependent(e.child,env):e.op==='and'?evalIndependent(e.left,env)&&evalIndependent(e.right,env):e.op==='or'?evalIndependent(e.left,env)||evalIndependent(e.right,env):!evalIndependent(e.left,env)||evalIndependent(e.right,env);
 for(let task=0;task<3;task++)for(let n=0;n<=histories[task].length;n++){const e=clauseReplay(task,histories[task].slice(0,n));for(const {path} of clauseNodes(e))for(const rule of Object.keys(clauseRules)){let changed;try{changed=clauseRewrite(e,path,rule);}catch{continue;}for(let i=0;i<8;i++){const env={A:!!(i&4),B:!!(i&2),C:!!(i&1)};assert.equal(evalIndependent(changed,env),evalIndependent(e,env));}}}
 const negatedConjunction={op:'not',child:{op:'and',left:{op:'var',name:'A'},right:{op:'var',name:'B'}}},expanded=clauseRewrite(negatedConjunction,'','demorgan');
 for(let i=0;i<8;i++){const env={A:!!(i&4),B:!!(i&2),C:!!(i&1)};assert.equal(evalIndependent(expanded,env),evalIndependent(negatedConjunction,env));}
 assert.throws(()=>clauseRewrite(clauseInitial(0),'N','imp'));assert.throws(()=>clauseReplay(0,[{path:'',rule:'double'}]));
});
test('restoration validates proof history and completed tasks',()=>{
 const q=clauseCreate();q.histories=histories;q.verified=[true,true,true];q.reflection='equivalence';assert.equal(clauseDone(q),true);const copy=clauseRestore(q);copy.histories[0].pop();assert.equal(q.histories[0].length,3);
 assert.throws(()=>clauseRestore({...q,histories:[[],histories[1],histories[2]]}));assert.throws(()=>clauseRestore({...q,path:'NNNN'}));
});
