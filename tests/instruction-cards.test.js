import {test} from 'node:test';
import assert from 'node:assert/strict';
import {instructionCards,instructionBits,instructionExecute,instructionFullRun,createInstructionCards,instructionCardsComplete,restoreInstructionCards} from '../src/instruction-cards.js';

test('命令札のビット表現を解読し、条件付きの約束を実行する',()=>{
 assert.deepEqual(Object.keys(instructionCards).map(instructionBits),['000 01100','011 00100','001 01101','010 01100','100 00000']);
 const correct=['load','jump','add','store','halt'];
 const zero=instructionFullRun(correct,0),three=instructionFullRun(correct,3);
 assert.equal(zero.status,'halt');assert.equal(zero.value,0);assert.equal(zero.steps,3);assert.equal(three.status,'halt');assert.equal(three.value,5);assert.equal(three.steps,5);
 const branch=instructionExecute(correct,0,2);assert.equal(branch.pc,4);assert.equal(branch.last.opcode,3);assert.equal(branch.last.arg,4);
 const incorrect=instructionFullRun(['load','add','jump','store','halt'],0);assert.equal(incorrect.value,2);assert.equal(incorrect.status,'halt');
});
test('５枚の全順列と２入力が停止または範囲外を明示して終わる',()=>{
 const permute=items=>items.length?items.flatMap((x,i)=>permute([...items.slice(0,i),...items.slice(i+1)]).map(rest=>[x,...rest])):[[]];
 const orders=permute(Object.keys(instructionCards));assert.equal(orders.length,120);
 for(const order of orders)for(const n of [0,3]){const r=instructionFullRun(order,n);assert.ok(['halt','fault','limit'].includes(r.status));assert.ok(r.steps<=20);assert.throws(()=>instructionExecute(order,n,r.steps+1),RangeError);}
});
test('２入力と振り返りを確認し、途中記録と正解記録を検証する',()=>{
 const s=createInstructionCards();s.order=['load','jump','add','store','halt'];s.passed=[0,3];s.answer='encoding';assert.equal(instructionCardsComplete(s),false);s.checked=true;assert.equal(instructionCardsComplete(s),true);
 const r=restoreInstructionCards(s);r.order.reverse();assert.equal(s.order[0],'load');
 for(const p of [{order:['load']},{input:2},{run:{input:3,steps:1}},{run:{input:0,steps:100}},{passed:[0,0]},{answer:'bad'},{checked:1}])assert.throws(()=>restoreInstructionCards({...s,...p}),RangeError);
 assert.throws(()=>restoreInstructionCards({...s,order:['load','add','jump','store','halt'],passed:[0]}),RangeError);
});
