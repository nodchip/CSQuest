import test from 'node:test';
import assert from 'node:assert/strict';
import {warehouseOutcome,createTestWorkshop,testWorkshopAct,restoreTestWorkshop,testWorkshopComplete} from '../src/test-workshop.js';
const act=(s,a)=>{const r=testWorkshopAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
test('倉庫の実際と期待値の一致は独立して判定する',()=>{
 assert.deepEqual(warehouseOutcome('correct',3),{status:'issued',remaining:2});assert.deepEqual(warehouseOutcome('double',3),{status:'issued',remaining:1});assert.deepEqual(warehouseOutcome('correct',0),{status:'refused',remaining:0});assert.deepEqual(warehouseOutcome('empty',0),{status:'issued',remaining:-1});
 for(const version of ['correct','double','empty'])for(const initial of [0,3])for(const status of ['issued','refused'])for(const remaining of [0,1,2]){
  let s=createTestWorkshop();for(const a of [`version:${version}`,`initial:${initial}`,`status:${status}`,`remaining:${remaining}`,'run'])s=act(s,a);
  const actual=warehouseOutcome(version,initial),spec=warehouseOutcome('correct',initial);assert.equal(s.report.pass,actual.status===status&&actual.remaining===remaining);assert.equal(s.report.oracleCorrect,spec.status===status&&spec.remaining===remaining);
 }
 assert.throws(()=>warehouseOutcome('other',3));assert.throws(()=>warehouseOutcome('correct',1));
});
test('誤期待の誤判定と２つの正しい試験、振り返りを要する',()=>{
 let s=createTestWorkshop();for(const a of ['run','version:double','run','remaining:1','run','version:correct','run','initial:0','status:refused','remaining:0','run','version:empty','run','answer:separate'])s=act(s,a);
 assert.equal(testWorkshopComplete(s),false);s=act(s,'check');assert.equal(testWorkshopComplete(s),true);assert.deepEqual(restoreTestWorkshop(JSON.parse(JSON.stringify(s))),s);
});
test('不正な途中操作を拒否する',()=>{assert.throws(()=>restoreTestWorkshop({history:['initial:7']}));assert.throws(()=>restoreTestWorkshop({history:[null]}));assert.throws(()=>restoreTestWorkshop({history:Array(129).fill('run')}));});
