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
 h=[...h,'second:A','second:B'];const q=electionCreate();q.trials.once=h;q.trials.multiple=['first:A','first:B','predict:many','second:A','second:B','second:C'];q.trials.durable=['first:A','first:B','restart:A','predict:one','second:A','second:B','second:C'];q.trials.volatile=['first:A','first:B','restart:A','predict:many','second:A','second:B','second:C'];assert.equal(electionComplete(q),false);q.reflection='scope';assert.equal(electionComplete(q),true);
 const copy=electionRestore(q);copy.trials.once.pop();assert.equal(electionComplete(copy),false);assert.equal(electionComplete(q),true);
 assert.throws(()=>electionReplay('once',['first:A','first:A']));assert.throws(()=>electionReplay('once',['first:A','first:B','predict:many']));
});
test('a restarted first voter enables a second majority only if its earlier vote is forgotten',()=>{
 for(const order of orders(electionVoters))for(const second of orders(electionVoters))for(const mode of ['durable','volatile'])for(const restarted of order.slice(0,2)){
  let h=[];const steps=[`first:${order[0]}`,`first:${order[1]}`,`restart:${restarted}`,`predict:${mode==='durable'?'one':'many'}`,...second.map(x=>`second:${x}`)];
  for(const a of steps){const r=electionStep(mode,h,a);assert.equal(r.ok,true,`${mode}: ${a}`);h=r.history;}
  const s=electionReplay(mode,h);assert.equal(s.restarted,restarted);assert.equal(s.done,true);assert.equal(s.secondVotes.length,mode==='durable'?1:2);
  assert.equal(s.secondVotes.includes(restarted),mode==='volatile');
 }
 assert.throws(()=>electionReplay('durable',['first:A','first:B','restart:C']));assert.throws(()=>electionReplay('volatile',['first:A','first:B','predict:many']));
});
test('older records preserve existing trials and start restart scenarios empty',()=>{
 const old={selected:'once',reflection:'scope',trials:{once:['first:A'],multiple:[]}},q=electionRestore(old);
 assert.deepEqual(q.trials.once,['first:A']);assert.deepEqual(q.trials.durable,[]);assert.deepEqual(q.trials.volatile,[]);assert.equal(electionComplete(q),false);
});
