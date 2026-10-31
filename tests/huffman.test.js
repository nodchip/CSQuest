import test from 'node:test';
import assert from 'node:assert/strict';
import {huffmanWeights,createHuffman,toggleHuffman,mergeHuffman,huffmanCodes,huffmanCost,restoreHuffman} from '../src/huffman.js';

function minimumMergeCost(weights){if(weights.length===1)return 0;let best=Infinity;for(let i=0;i<weights.length;i++)for(let j=i+1;j<weights.length;j++){const pair=weights[i]+weights[j],rest=weights.filter((_,k)=>k!==i&&k!==j);best=Math.min(best,pair+minimumMergeCost([...rest,pair]));}return best;}
test('every greedy tie and left-right ordering produces an optimal prefix-free code',()=>{
 const optimal=minimumMergeCost(Object.values(huffmanWeights));assert.equal(optimal,18);let completed=0;
 function explore(state){if(state.pool.length===1){completed++;const codes=huffmanCodes(state),list=Object.values(codes);assert.equal(huffmanCost(state),optimal);for(const a of list)for(const b of list)if(a!==b)assert.equal(b.startsWith(a),false);assert.deepEqual(restoreHuffman({history:state.history,selected:[]}),state);return;}
  for(const a of state.pool)for(const b of state.pool)if(a.id!==b.id){let next=toggleHuffman(toggleHuffman(state,a.id),b.id);next=mergeHuffman(next);if(next.history.length===state.history.length+1)explore(next);}}
 explore(createHuffman());assert.ok(completed>1);
});
test('wrong merges preserve progress and saved selections are checked',()=>{
 let state=createHuffman();state=toggleHuffman(toggleHuffman(state,'A'),'B');const wrong=mergeHuffman(state);assert.equal(wrong.history.length,0);assert.deepEqual(wrong.selected,['A','B']);assert.throws(()=>restoreHuffman({history:[['A','B']],selected:[]}),RangeError);assert.throws(()=>restoreHuffman({history:[],selected:['A','A']}),RangeError);
});
