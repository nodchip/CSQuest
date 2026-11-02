import test from 'node:test';
import assert from 'node:assert/strict';
import {unifyCases,unifyTrial,unifyStep,unifyCreate,unifyComplete,unifyRestore} from '../src/type-unification.js';

const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const apply=(t,subst)=>typeof t==='string'?(Object.hasOwn(subst,t)?apply(subst[t],subst):t):[t[0],...t.slice(1).map(x=>apply(x,subst))];
test('every legal equation order yields a valid substitution or the expected failure',()=>{
 for(const [id,c] of Object.entries(unifyCases)){
  let terminals=0;
  const visit=t=>{if(t.phase!=='working'){terminals++;assert.equal(t.phase,c.expected);if(t.phase==='solved')for(const [x,y] of c.equations)assert.ok(eq(apply(x,t.subst),apply(y,t.subst)));if(id==='open')assert.ok(['a','b'].some(v=>!Object.hasOwn(t.subst,v)));return;}let advanced=0;for(let index=0;index<t.equations.length;index++)for(const action of ['bind','decompose','remove','reject']){const next=structuredClone(t);if(unifyStep(next,index,action)){advanced++;visit(next);}}assert.ok(advanced>0);};
  visit(unifyTrial(id));assert.ok(terminals>0);
 }
});
test('finite ground assignments independently distinguish solvable and impossible examples',()=>{
 const terms=['n','l',['list','n'],['list','l'],['fn','n','n'],['fn','n','l'],['fn','l','n'],['fn','l','l']];
 for(const c of Object.values(unifyCases)){let found=false;for(const a of terms)for(const b of terms)if(c.equations.every(([x,y])=>eq(apply(x,{a,b}),apply(y,{a,b}))))found=true;assert.equal(found,c.expected==='solved');}
});
test('incorrect operations do not advance and saved actions are replayed',()=>{
 const s=unifyCreate(),t=s.trials.chain;assert.equal(unifyStep(t,0,'decompose'),false);assert.equal(t.history.length,0);
 for(const [id,c] of Object.entries(unifyCases)){const trial=s.trials[id];while(trial.phase==='working'){let acted=false;for(let i=0;i<trial.equations.length&&!acted;i++)for(const action of ['bind','decompose','remove','reject'])if(unifyStep(trial,i,action)){acted=true;break;}assert.ok(acted);}assert.equal(trial.phase,c.expected);}
 s.answer='finite';s.checked=true;assert.ok(unifyComplete(s));const copy=unifyRestore(s);copy.trials.chain.history.pop();assert.notEqual(copy.trials.chain.history.length,s.trials.chain.history.length);assert.throws(()=>unifyRestore({...s,trials:{...s.trials,chain:{history:[{index:0,action:'decompose'}],selected:0}}}));
});
