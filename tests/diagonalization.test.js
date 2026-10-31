import test from 'node:test';
import assert from 'node:assert/strict';
import {diagonalCases,diagonalVectors,diagonalPairs,diagonalApply,diagonalPairValid,createDiagonal,diagonalCorrect,diagonalComplete,restoreDiagonal} from '../src/diagonalization.js';
test('eigenvectors and independent pairs agree with the transformations',()=>{
 assert.deepEqual(Object.keys(diagonalPairs).filter(p=>diagonalPairValid('distinct',p)),['xd']);assert.deepEqual(Object.keys(diagonalPairs).filter(p=>diagonalPairValid('shear',p)),['none']);assert.deepEqual(Object.keys(diagonalPairs).filter(p=>diagonalPairValid('identity',p)),['xy','xd','yd']);
 assert.equal(diagonalApply('distinct','x').lambda,2);assert.equal(diagonalApply('distinct','diagonal').lambda,1);
 for(let x=-5;x<=5;x++)for(let y=-5;y<=5;y++){if(x===0&&y===0)continue;const out=[x+y,y],cross=out[0]*y-out[1]*x;assert.equal(cross===0,y===0);}
 const S=[[1,1],[0,-1]],D=[[2,0],[0,1]],mul=(a,b)=>a.map(row=>b[0].map((_,j)=>row.reduce((sum,n,i)=>sum+n*b[i][j],0)));assert.deepEqual(mul(mul(S,D),S),diagonalCases.distinct.matrix);
 assert.throws(()=>diagonalApply('bad','x'));
});
test('every trial, valid basis, and proof for the shear are required',()=>{
 const s=createDiagonal();for(const [id,t] of Object.entries(s.trials)){t.seen=Object.keys(diagonalVectors);t.pair=id==='distinct'?'xd':id==='identity'?'xy':'none';t.reason=id==='shear'?'samples':null;t.checked=true;}assert.equal(diagonalCorrect('shear',s.trials.shear),false);s.trials.shear.reason='y-zero';assert.equal(diagonalComplete(s),true);assert.deepEqual(restoreDiagonal(s),s);const copy=restoreDiagonal(s);copy.trials.identity.pair='none';assert.equal(diagonalComplete(copy),false);assert.equal(s.trials.identity.pair,'xy');assert.throws(()=>restoreDiagonal({...s,selected:'bad'}));
});
