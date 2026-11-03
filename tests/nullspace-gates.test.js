import test from 'node:test';
import assert from 'node:assert/strict';
import {nullspaceCases,nullspaceOutput,nullspaceMarker,nullspaceCreate,nullspaceRestore,nullspaceDone} from '../src/nullspace-gates.js';
test('all 27 input vectors match both independent equation systems',()=>{
 for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++){assert.deepEqual(nullspaceOutput(0,[x,y,z]),[x+y,y+z]);assert.deepEqual(nullspaceOutput(1,[x,y,z]),[x+y,2*x+2*y]);}
 assert.equal(nullspaceMarker(0,[1,-1,1]),'forward');assert.equal(nullspaceMarker(0,[-1,1,-1]),'reverse');assert.equal(nullspaceMarker(1,[1,-1,0]),'base-x');assert.equal(nullspaceMarker(1,[0,0,1]),'base-z');assert.equal(nullspaceMarker(1,[1,-1,1]),'both');assert.equal(nullspaceMarker(0,[0,0,0]),null);
});
test('observations, correct nullity and interpretation required; records validated and copied',()=>{
 const q=nullspaceCreate();q.seen=nullspaceCases.map(x=>[...x.requirements]);q.dimensions=[1,2];q.reflection='orthogonal';assert.equal(nullspaceDone(q),true);const copy=nullspaceRestore(q);copy.seen[0].pop();assert.equal(q.seen[0].length,3);assert.throws(()=>nullspaceRestore({...q,seen:[['base-z'],[]]}));q.dimensions[1]=1;assert.equal(nullspaceDone(q),false);
});
