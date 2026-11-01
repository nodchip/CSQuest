import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveClauses,replayResolution,createResolution,restoreResolution,resolutionComplete} from '../src/resolution-trail.js';
import {createChainingTrail,restoreChainingTrail} from '../src/chaining-trail.js';
test('both valid refutation routes lead to the empty clause',()=>{
 for(const history of [[{a:0,b:1,pivot:'P'},{a:3,b:2,pivot:'Q'}],[{a:1,b:2,pivot:'Q'},{a:0,b:3,pivot:'P'}]]){const s={...createResolution(),history};assert.deepEqual(replayResolution(history).at(-1),[]);assert.equal(resolutionComplete(s),true);assert.deepEqual(restoreResolution(s),s);}
 assert.throws(()=>replayResolution([{a:0,b:2,pivot:'P'}]));assert.throws(()=>replayResolution([{a:0,b:1,pivot:'Q'}]));assert.throws(()=>replayResolution([{a:0,b:0,pivot:'P'}]));
});
test('resolution preserves truth for each assignment and old drafts migrate',()=>{
 const clauses=[['P'],['!P','Q'],['!Q'],['Q'],['!P']];
 const value=(clause,p,q)=>clause.some(x=>({P:p,'!P':!p,Q:q,'!Q':!q})[x]);
 for(const a of clauses)for(const b of clauses)for(const pivot of ['P','Q']){let result;try{result=resolveClauses(a,b,pivot);}catch{continue;}for(const p of [false,true])for(const q of [false,true])if(value(a,p,q)&&value(b,p,q))assert.ok(value(result,p,q));}
 const old=createChainingTrail();delete old.resolution;assert.equal(resolutionComplete(restoreChainingTrail(old).resolution),false);
 assert.throws(()=>restoreResolution({history:[],selected:[0,0],pivot:'P'}));
});
