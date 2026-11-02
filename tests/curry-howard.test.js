import test from 'node:test';
import assert from 'node:assert/strict';
import {curryCases,curryRoot,curryFirst,curryOptions,curryApply,curryReplay,curryVerify,curryCreate,curryDone,curryComplete,curryRestore} from '../src/curry-howard.js';

const solutions={identity:['intro','use:0'],swap:['intro','unpack:0','pair','use:2','use:1'],apply:['intro','unpack:0','apply:1','use:2'],either:['intro','case:0','right','use:1','left','use:1'],distribute:['intro','unpack:0','case:2','left','pair','use:1','use:3','right','pair','use:1','use:3']};
// Independent natural-deduction checker: ignore each node's displayed context.
function derive(node,env=[]){
 const [rule,raw]=node.rule.split(':'),i=Number(raw),children=node.children;
 if(rule==='use'){assert.equal(children.length,0);return env[i];}
 if(rule==='intro'){assert.equal(children.length,1);assert.equal(node.goal[0],'fn');return ['fn',node.goal[1],derive(children[0],[...env,node.goal[1]])];}
 if(rule==='pair'){assert.equal(children.length,2);return ['pair',derive(children[0],env),derive(children[1],env)];}
 if(rule==='left'||rule==='right'){assert.equal(children.length,1);assert.equal(node.goal[0],'sum');const component=derive(children[0],env);return rule==='left'?['sum',component,node.goal[2]]:['sum',node.goal[1],component];}
 if(rule==='apply'){assert.equal(children.length,1);assert.equal(env[i][0],'fn');assert.deepEqual(derive(children[0],env),env[i][1]);return env[i][2];}
 if(rule==='unpack'){assert.equal(children.length,1);assert.equal(env[i][0],'pair');return derive(children[0],[...env,env[i][1],env[i][2]]);}
 if(rule==='case'){assert.equal(children.length,2);assert.equal(env[i][0],'sum');const left=derive(children[0],[...env,env[i][1]]),right=derive(children[1],[...env,env[i][2]]);assert.deepEqual(left,right);return left;}
 throw Error('unknown rule');
}
test('the five constructions satisfy the target with the correct scoped assumptions',()=>{
 for(const [id,history] of Object.entries(solutions)){const root=curryReplay(id,history);assert.equal(curryFirst(root),null);assert.ok(curryVerify(root,curryCases[id].goal));assert.deepEqual(derive(root),curryCases[id].goal);assert.ok(curryDone(id,history));const tampered=structuredClone(root);tampered.children[0].ctx=[];assert.equal(curryVerify(tampered,curryCases[id].goal),false);}
});
test('independent truth tables validate the requested propositions',()=>{
 const evaluate=(type,values)=>{if(typeof type==='string')return values[type];const a=evaluate(type[1],values),b=evaluate(type[2],values);return type[0]==='fn'?!a||b:type[0]==='pair'?a&&b:a||b;};
 for(const {goal} of Object.values(curryCases))for(let bits=0;bits<8;bits++)assert.equal(evaluate(goal,{A:!!(bits&1),B:!!(bits&2),C:!!(bits&4)}),true);
});
test('invalid steps and unfinished or wrong branches cannot count as complete',()=>{
 const root=curryRoot('identity');assert.equal(curryApply(root,'use:0'),false);assert.equal(curryVerify(root,curryCases.identity.goal),false);assert.throws(()=>curryReplay('identity',['intro','use:1']));
 const wrong=curryReplay('either',['intro','case:0','left']);assert.equal(curryOptions(curryFirst(wrong)).some(o=>o.id.startsWith('use:')),false);assert.equal(curryVerify(wrong,curryCases.either.goal),false);
});
test('all constructions and reflection are needed and history restores without sharing',()=>{
 const s=curryCreate();for(const [id,h] of Object.entries(solutions))s.histories[id]=h.slice();s.answer='correspond';s.checked=true;assert.ok(curryComplete(s));const restored=curryRestore(s);restored.histories.identity.pop();assert.equal(s.histories.identity.length,2);assert.equal(curryComplete(restored),false);assert.throws(()=>curryRestore({...s,histories:{...s.histories,identity:['intro','use:8']}}));
});
