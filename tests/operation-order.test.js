import test from 'node:test';
import assert from 'node:assert/strict';
import {orderValue,createOrderTrial,stepOrder,orderCorrect,createOrder,orderComplete,restoreOrder} from '../src/operation-order.js';

test('addition commutes in this example but doubling and addition do not',()=>{
  for(let n=-10;n<=10;n++){assert.equal(orderValue('add','B',orderValue('add','A',n)),orderValue('add','A',orderValue('add','B',n)));assert.equal(orderValue('mix','B',orderValue('mix','A',n))+3,orderValue('mix','A',orderValue('mix','B',n)));}
  const all=createOrder();for(const [id,order,result] of [['addAB',['A','B'],7],['addBA',['B','A'],7],['mixAB',['A','B'],7],['mixBA',['B','A'],10]]){let s=createOrderTrial(id);for(const w of order)s=stepOrder(s,w);assert.equal(s.value,result);s.prediction=String(result);s.checked=true;assert.ok(orderCorrect(s));all.trials[id]=s;}assert.ok(orderComplete(all));
});
test('repeated operations do not advance and unfinished drafts replay safely',()=>{
  let s=createOrderTrial('mixAB');s=stepOrder(s,'A');assert.equal(stepOrder(s,'A').history.length,1);
  const trials={addAB:{history:[],prediction:'',checked:false},addBA:{history:[],prediction:'',checked:false},mixAB:{history:['A'],prediction:'7',checked:false},mixBA:{history:[],prediction:'',checked:false}};
  assert.equal(restoreOrder({selected:'mixAB',trials}).trials.mixAB.value,4);
  assert.throws(()=>restoreOrder({selected:'mixAB',trials:{...trials,mixAB:{history:['A','A'],prediction:'',checked:false}}}));
});
