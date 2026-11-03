import test from 'node:test';
import assert from 'node:assert/strict';
import {intervalReasonNames,intervalReasonRelation,intervalReasonCreate,intervalReasonCheck,intervalReasonRestore,intervalReasonDone} from '../src/interval-reasoning.js';
const intervals=[];for(let s=0;s<6;s++)for(let e=s+1;e<=6;e++)intervals.push([s,e]);
test('all thirteen relations and their inverses are represented',()=>{
 const inverse={before:'after',meets:'metBy',overlaps:'overlappedBy',starts:'startedBy',during:'contains',finishes:'finishedBy',equal:'equal',finishedBy:'finishes',contains:'during',startedBy:'starts',overlappedBy:'overlaps',metBy:'meets',after:'before'};
 const examples=[['before',[1,4],[5,6]],['meets',[1,4],[4,6]],['overlaps',[1,4],[2,5]],['starts',[1,4],[1,5]],['during',[1,4],[0,5]],['finishes',[1,4],[0,4]],['equal',[1,4],[1,4]],['finishedBy',[1,4],[2,4]],['contains',[1,4],[2,3]],['startedBy',[1,4],[1,3]],['overlappedBy',[1,4],[0,2]],['metBy',[1,4],[0,1]],['after',[2,4],[0,1]]];
 for(const [expected,a,b] of examples)assert.equal(intervalReasonRelation(a,b),expected);
 const seen=new Set();for(const a of intervals)for(const b of intervals){const r=intervalReasonRelation(a,b);seen.add(r);assert.equal(intervalReasonRelation(b,a),inverse[r]);}assert.deepEqual([...seen].sort(),Object.keys(intervalReasonNames).sort());
 assert.throws(()=>intervalReasonRelation([2,2],[0,1]));
});
test('composition of two meets and two overlaps is checked across all finite triples',()=>{
 const overlapResults=new Set();let meets=0;
 for(const a of intervals)for(const b of intervals)for(const c of intervals){const ab=intervalReasonRelation(a,b),bc=intervalReasonRelation(b,c),ac=intervalReasonRelation(a,c);if(ab==='meets'&&bc==='meets'){meets++;assert.equal(ac,'before');}if(ab==='overlaps'&&bc==='overlaps')overlapResults.add(ac);}
 assert.ok(meets>0);assert.deepEqual([...overlapResults].sort(),['before','meets','overlaps']);
});
test('recorded examples and the projection limitation are needed and drafts copy',()=>{
 const q=intervalReasonCreate();q.scene='space';assert.deepEqual(intervalReasonCheck(q),{ab:'overlaps',bc:'overlaps',ac:'before',qualifies:true});q.timeSeen=true;q.spaceSeen=['before','meets','overlaps'];q.reflection='projection';assert.equal(intervalReasonDone(q),true);
 const copy=intervalReasonRestore(q);copy.positions.space[0][0]=1;copy.spaceSeen.pop();assert.equal(q.positions.space[0][0],0);assert.equal(intervalReasonDone(copy),false);assert.throws(()=>intervalReasonRestore({...q,spaceSeen:['before','before']}));
});
