import test from 'node:test';
import assert from 'node:assert/strict';
import {tryTypeCards,replayTypeCards,inspectBranch,replayTypeBranch} from '../src/endgame-types.js';

test('number and boolean cards remain distinct; valid but wrong sums fail',()=>{
 assert.equal(tryTypeCards({kind:'add',target:3},['n2','n1']).value,3);
 assert.equal(tryTypeCards({kind:'add',target:3},['n0','n2']).ok,false);
 assert.match(tryTypeCards({kind:'add',target:3},['n1','yes']).reason,/数札/);
 assert.equal(tryTypeCards({kind:'gate',target:false},['n0',null]).ok,false);
 assert.equal(tryTypeCards({kind:'gate',target:false},['no',null]).ok,true);
 assert.equal(tryTypeCards({kind:'record',target:{level:0,signal:false}},['n0','no']).ok,true);
 assert.equal(tryTypeCards({kind:'record',target:{level:0,signal:false}},['no','n0']).ok,false);
});
test('replay retains unfinished and corrected input while rejecting invalid completion',()=>{
 const h=['put:0:yes','put:0:n2','put:1:n1','run','put:0:n0'];
 assert.deepEqual(replayTypeCards('tools',h).slots,['n0',null]);
 assert.equal(replayTypeCards('tools',['put:0:yes','run']),null);
 assert.equal(replayTypeCards('record',['put:1:yes','put:0:n2','run']).scene,1);
});
test('static and dynamic checks differ on an unchosen bad branch',()=>{
 assert.equal(inspectBranch({condition:true,repaired:false,mode:'static'}),'type-error');
 assert.equal(inspectBranch({condition:true,repaired:false,mode:'dynamic'}),'3');
 assert.equal(inspectBranch({condition:false,repaired:false,mode:'dynamic'}),'type-error');
 assert.equal(inspectBranch({condition:false,repaired:true,mode:'static'}),'pass');
 assert.equal(inspectBranch({condition:false,repaired:true,mode:'dynamic'}),'3');
 assert.equal(replayTypeBranch(['run','mode:dynamic','run']).scene,2);
 assert.equal(replayTypeBranch(['mode:dynamic','run']),null);
});
test('all branch settings have the expected result in the miniature',()=>{
 const expected=[
  [true,false,'static','type-error'],[false,false,'static','type-error'],
  [true,true,'static','pass'],[false,true,'static','pass'],
  [true,false,'dynamic','3'],[false,false,'dynamic','type-error'],
  [true,true,'dynamic','3'],[false,true,'dynamic','3']
 ];
 for(const [condition,repaired,mode,result] of expected)assert.equal(inspectBranch({condition,repaired,mode}),result);
 assert.equal(inspectBranch({condition:0,repaired:false,mode:'static'}),null);
});
test('completed histories reconstruct the actual conditions and outcomes',()=>{
 const tools=replayTypeCards('tools',['put:0:n1','put:1:n2','run','put:0:n0','put:1:n2','run','put:0:yes','run','put:0:no','run']);
 assert.equal(tools.done,true);
 assert.deepEqual(tools.results.map(x=>x.value),[3,2,true,false]);
 const branch=replayTypeBranch(['run','mode:dynamic','run','condition:no','mode:dynamic','run','condition:no','repair:yes','run','condition:no','repair:yes','mode:dynamic','run']);
 assert.equal(branch.done,true);
 assert.deepEqual(branch.results.map(x=>[x.condition,x.repaired,x.mode,x.result]),[[true,false,'static','type-error'],[true,false,'dynamic','3'],[false,false,'dynamic','type-error'],[false,true,'static','pass'],[false,true,'dynamic','3']]);
});
