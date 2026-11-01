import test from 'node:test';
import assert from 'node:assert/strict';
import {sizeCases,sizeModes,sizeResult,createSizeOverflow,sizeTrialPass,sizeOverflowComplete,restoreSizeOverflow} from '../src/size-overflow.js';

test('all eight-bit operands respect the modeled capacity and precondition',()=>{
 for(let count=0;count<=255;count++)for(let width=1;width<=255;width++){
  const expected=BigInt(count)*BigInt(width);const wrapped=Number(expected%256n);const plain=sizeResult(count,width,'none'),after=sizeResult(count,width,'after'),before=sizeResult(count,width,'before');
  assert.equal(plain.stored,wrapped);assert.equal(plain.outside,Number(expected)-wrapped);assert.deepEqual(after,plain);
  assert.equal(before.outcome,expected>255n?'rejected':'fits');if(expected<=255n)assert.equal(before.allocated,Number(expected));else assert.equal(before.allocated,null);
 }
});
test('boundaries, comparison completion and saved choices are validated',()=>{
 assert.equal(sizeResult(31,8,'none').outcome,'fits');assert.deepEqual(sizeResult(32,8,'after'),{needed:256,stored:0,allocated:0,outside:256,outcome:'outside'});assert.equal(sizeResult(32,4,'before').outcome,'fits');assert.equal(sizeResult(40,8,'before').outcome,'rejected');
 const s=createSizeOverflow();for(const m of Object.keys(sizeModes))for(const [c,item] of Object.entries(sizeCases)){s.trials[m][c]={guess:sizeResult(item.count,item.width,m).outcome,checked:true};assert.ok(sizeTrialPass(s,m,c));}s.answer='before';s.checked=true;assert.ok(sizeOverflowComplete(s));const r=restoreSizeOverflow(s);r.trials.none.edge.guess='outside';assert.notEqual(r.trials.none.edge.guess,s.trials.none.edge.guess);assert.equal(sizeOverflowComplete(r),false);assert.throws(()=>restoreSizeOverflow({...s,trials:{...s.trials,none:{...s.trials.none,edge:{guess:null,checked:true}}}}));
});
