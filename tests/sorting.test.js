import test from 'node:test';
import assert from 'node:assert/strict';
import { isSorted, sortingLevel, swapAdjacent, restoreSorting } from '../src/sorting.js';

test('the original order can be sorted with five adjacent swaps', () => {
  let values = sortingLevel.initial;
  for (const index of [0, 1, 2, 1, 0]) values = swapAdjacent(values, index);
  assert.deepEqual(values, [1, 2, 3, 4]);
  assert.equal(isSorted(values), true);
  assert.deepEqual(sortingLevel.initial, [4, 2, 3, 1]);
});

test('sorting checks every adjacent pair and handles repeated numbers', () => {
  assert.equal(isSorted([1, 2, 2, 4]), true);
  assert.equal(isSorted([1, 3, 2, 4]), false);
});

test('only valid adjacent pairs can be swapped', () => {
  for (const index of [-1, 3, 0.5]) assert.throws(() => swapAdjacent([1, 2, 3, 4], index), RangeError);
});
test('sorting drafts must be reachable by the stated number of swaps',()=>{
  const values=swapAdjacent(sortingLevel.initial,0),saved={values,count:1},restored=restoreSorting(saved);
  saved.values[0]=99;assert.deepEqual(restored.values,[2,4,3,1]);
  assert.deepEqual(restoreSorting({values:sortingLevel.initial,count:2}).values,sortingLevel.initial);
  assert.throws(()=>restoreSorting({values:sortingLevel.initial,count:1}),RangeError);
  assert.throws(()=>restoreSorting({values:[1,2,3,4],count:3}),RangeError);
  assert.throws(()=>restoreSorting({values:[4,2,2,1],count:1}),RangeError);
});
test('draft reachability agrees with exhaustive adjacent-swap exploration',()=>{
  let reachable=new Set([sortingLevel.initial.join(',')]);
  const permutations=(values)=>values.length===0?[[]]:values.flatMap((v,i)=>permutations(values.filter((_,j)=>j!==i)).map(rest=>[v,...rest]));
  const all=permutations(sortingLevel.initial);
  for(let count=0;count<=8;count++){
    for(const values of all){
      const expected=reachable.has(values.join(','));
      let accepted=true;try{restoreSorting({values,count});}catch{accepted=false;}
      assert.equal(accepted,expected,`${values} at ${count} swaps`);
    }
    const next=new Set();for(const item of reachable){const values=item.split(',').map(Number);for(let i=0;i<3;i++)next.add(swapAdjacent(values,i).join(','));}reachable=next;
  }
});
