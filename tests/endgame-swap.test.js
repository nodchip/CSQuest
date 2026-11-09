import test from 'node:test';
import assert from 'node:assert/strict';
import {runSwap,swapCases} from '../src/endgame-swap.js';

test('a spare box preserves the first value during a swap',()=>{
 const instructions=['C:A','A:B','B:C'];
 for(const input of swapCases){const result=runSwap(instructions,input);assert.equal(result.success,true);assert.deepEqual([result.boxes.A,result.boxes.B],[input[1],input[0]]);}
 assert.deepEqual(runSwap(instructions,['赤','青']).history.map(x=>[x.A,x.B,x.C]),[['赤','青','赤'],['青','青','赤'],['青','赤','赤']]);
});
test('overwriting before saving the value does not exchange it',()=>{
 assert.equal(runSwap(['A:B','B:A'],['赤','青']).success,false);
 assert.equal(runSwap(['A:C','B:A'],['赤','青']).success,false);
 assert.equal(runSwap(['D:A'],['赤','青']),null);
 assert.equal(runSwap(Array(6).fill('A:B'),['赤','青']),null);
});
