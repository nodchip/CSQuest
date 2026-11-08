import test from 'node:test';
import assert from 'node:assert/strict';
import {mountainButtonOrder,mountainReplay} from '../src/mountain.js';
import {searchButtonOrder,expansionReplay} from '../src/adventure-expansion.js';

test('choosing the first available location does not complete the mountain routes',()=>{
 for(const id of ['mountain-connect','mountain-hops','mountain-time']){
  let path=[];
  for(let i=0;i<6;i++){
   const state=mountainReplay(id,path);if(state.done||!state.next.length)break;
   const first=mountainButtonOrder.find(node=>state.next.includes(node));path.push(first);
  }
  assert.equal(mountainReplay(id,path).done,false,id);
 }
});
test('the first available location after the start is not the correct search choice',()=>{
 for(const id of ['search-bfs','search-weighted']){
  const history=['s'],state=expansionReplay(id,history);
  const first=searchButtonOrder.find(node=>state.queue.includes(node));
  assert.equal(first,'b');
  assert.throws(()=>expansionReplay(id,[...history,first]));
 }
});
