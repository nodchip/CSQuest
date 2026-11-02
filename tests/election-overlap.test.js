import test from 'node:test';
import assert from 'node:assert/strict';
import {electionVoters,electionReplay,electionStep,electionCreate,electionComplete,electionRestore} from '../src/election-overlap.js';
const orders=a=>a.flatMap(x=>a.filter(y=>y!==x).flatMap(y=>a.filter(z=>z!==x&&z!==y).map(z=>[x,y,z])));

test('all first-majority pairs and request orders preserve or violate uniqueness in the stated models',()=>{
 for(const order of orders(electionVoters))for(const second of orders(electionVoters))for(const mode of ['once','multiple']){
  let h=[];for(const a of [`first:${order[0]}`,`first:${order[1]}`,`predict:${mode==='once'?'one':'many'}`,...second.map(x=>`second:${x}`)]){const r=electionStep(mode,h,a);assert.equal(r.ok,true);h=r.history;}
  const s=electionReplay(mode,h);assert.equal(s.done,true);assert.equal(s.first.length,2);assert.equal(s.secondVotes.length,mode==='once'?1:3);
  if(mode==='once')assert.equal(s.secondVotes.some(x=>s.first.includes(x)),false);
 }
});
test('prediction, unique requests and both scenarios are required; history is validated and copied',()=>{
 let h=['first:A','first:B'];assert.equal(electionStep('once',h,'predict:many').ok,false);assert.equal(electionStep('once',h,'second:C').ok,false);
 h=electionStep('once',h,'predict:one').history;h=electionStep('once',h,'second:C').history;assert.equal(electionStep('once',h,'second:C').ok,false);
 h=[...h,'second:A','second:B'];const q=electionCreate();q.trials.once=h;q.trials.multiple=['first:A','first:B','predict:many','second:A','second:B','second:C'];assert.equal(electionComplete(q),false);q.reflection='scope';assert.equal(electionComplete(q),true);
 const copy=electionRestore(q);copy.trials.once.pop();assert.equal(electionComplete(copy),false);assert.equal(electionComplete(q),true);
 assert.throws(()=>electionReplay('once',['first:A','first:A']));assert.throws(()=>electionReplay('once',['first:A','first:B','predict:many']));
});
