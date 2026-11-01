import test from 'node:test';
import assert from 'node:assert/strict';
import {linkCases,linkArrival,linkBest,linkCorrect,linksComplete,createLinks,restoreLinks} from '../src/link-choice.js';
test('transmission and propagation times lead to different optimal routes, a tie, and a missed deadline',()=>{
 const expected={small:[3,4.5,'near'],large:[13,7,'wide'],tie:[5,5,'both'],late:[13,7,'none']};
 for(const [id,[near,wide,best]] of Object.entries(expected)){assert.equal(linkArrival(id,'near').arrival,near);assert.equal(linkArrival(id,'wide').arrival,wide);assert.equal(linkBest(id),best);}
 assert.throws(()=>linkArrival('small','other'));
});
test('both observations and a correct checked choice are required and old drafts are migrated',()=>{
 const s=createLinks();for(const id of Object.keys(linkCases)){s[id]={observed:['near','wide'],choice:linkBest(id),checked:true};assert.ok(linkCorrect(id,s[id]));}assert.ok(linksComplete(s));assert.deepEqual(restoreLinks(s),s);assert.equal(linksComplete(restoreLinks(undefined)),false);
 assert.equal(linkCorrect('small',{observed:['near'],choice:'near',checked:true}),false);assert.throws(()=>restoreLinks({...s,small:{observed:['near','near'],choice:'near',checked:true}}));
});
