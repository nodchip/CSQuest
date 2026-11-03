import test from 'node:test';
import assert from 'node:assert/strict';
import {arrayMachineCards,arrayMachineCases,arrayMachineRun,arrayMachineFull,arrayMachineCreate,arrayMachinePassed,arrayMachineRestore,arrayMachineDone} from '../src/array-machine.js';
const correct=['read','add','advance','branch','halt'];
test('the correct program reads each element, updates pointer, and terminates at the boundary',()=>{
 const a=arrayMachineFull(correct,'three'),b=arrayMachineFull(correct,'two');assert.deepEqual([a.status,a.sum,a.p,a.steps],['halt',6,3,13]);assert.deepEqual([b.status,b.sum,b.p,b.steps],['halt',4,2,9]);
 assert.deepEqual(arrayMachineRun(correct,'three',1),{pc:1,p:0,temp:3,sum:0,status:'running',last:{pc:0,cmd:'read'}});assert.equal(arrayMachineRun(correct,'three',4).pc,0);assert.equal(arrayMachineRun(correct,'three',12).pc,4);
 assert.throws(()=>arrayMachineRun(correct,'two',10));
});
test('every permutation stops, faults or reaches the explicit limit in both cases',()=>{
 const perm=xs=>xs.length?xs.flatMap((x,i)=>perm([...xs.slice(0,i),...xs.slice(i+1)]).map(rest=>[x,...rest])):[[]];const orders=perm(Object.keys(arrayMachineCards));assert.equal(orders.length,120);
 for(const order of orders)for(const id of Object.keys(arrayMachineCases)){const r=arrayMachineFull(order,id);assert.ok(['halt','fault','limit'].includes(r.status));assert.ok(r.steps<=30);}
 assert.deepEqual(orders.filter(order=>Object.keys(arrayMachineCases).every(id=>arrayMachinePassed(order,id))),[correct,['read','advance','add','branch','halt']]);
 assert.equal(arrayMachineFull(['advance','read','add','branch','halt'],'two').status,'fault');assert.equal(arrayMachineFull(['read','add','branch','advance','halt'],'three').status,'limit');
});
test('restoration validates progress and both test inputs and reflection are required',()=>{
 const q=arrayMachineCreate();q.order=[...correct];q.passed=['three','two'];q.reflection='bounds';assert.equal(arrayMachineDone(q),true);for(const k of q.passed)assert.equal(arrayMachineDone({...q,passed:q.passed.filter(x=>x!==k)}),false);assert.equal(arrayMachineDone({...q,reflection:'forever'}),false);
 const r=arrayMachineRestore(q);r.order.reverse();r.passed.pop();assert.deepEqual(q.order,correct);assert.equal(q.passed.length,2);assert.throws(()=>arrayMachineRestore({...q,order:['advance','read','add','branch','halt']}));assert.throws(()=>arrayMachineRestore({...q,steps:30}));assert.equal(arrayMachinePassed(correct,'three'),true);
});
