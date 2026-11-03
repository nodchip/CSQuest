import test from 'node:test';
import assert from 'node:assert/strict';
import {subspaceMember,subspaceObserve,subspaceEvidence,subspaceCreate,subspaceRestore,subspaceDone} from '../src/subspace-gates.js';
test('set membership and operations agree with their definitions over the integer grid',()=>{
 for(let x=-3;x<=3;x++)for(let y=-3;y<=3;y++)for(let i=0;i<4;i++)assert.equal(subspaceMember(i,[x,y]),[y===x,y===x+1,x>=0&&y>=0,x===0||y===0][i]);
 for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let k=-1;k<=1;k++){const r=subspaceObserve(0,[x,y],[a,b],k);assert.deepEqual(r.sumVector,[x+a,y+b]);assert.deepEqual(r.scaledVector,[k*x,k*y]);if(r.p&&r.q)assert.equal(r.sum,true);if(r.p)assert.equal(r.scaled,true);}
});
test('all four claims need suitable evidence and recorded claims restore defensively',()=>{
 assert.equal(subspaceEvidence(0,[1,1],[-1,-1],-1,'closed'),true);assert.equal(subspaceEvidence(1,[0,1],[0,0],1,'zero'),true);assert.equal(subspaceEvidence(2,[1,0],[0,0],-1,'scale'),true);assert.equal(subspaceEvidence(3,[1,0],[0,1],1,'sum'),true);
 assert.equal(subspaceEvidence(3,[1,0],[0,0],1,'sum'),false);const q=subspaceCreate();q.answers=['closed','zero','scale','sum'];q.seen=[true,true,true,true];q.reflection='proof';assert.equal(subspaceDone(q),true);const copy=subspaceRestore(q);copy.p[0]=1;assert.equal(q.p[0],0);assert.throws(()=>subspaceRestore({...q,answers:['sum','zero','scale','sum']}));
});
