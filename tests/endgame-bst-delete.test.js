import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {replayBstDelete} from '../src/endgame-bst-delete.js';
const validate=nodes=>{const walk=(id,lo,hi)=>{if(id===null)return [];const n=nodes[id];assert.ok(n);assert.ok(n.key>lo&&n.key<hi);return [...walk(n.left,lo,n.key),n.key,...walk(n.right,n.key,hi)];};return walk(8,-Infinity,Infinity);};
const initial=[2,4,6,8,9,9.5,10,11,12,14];
test('葉を取り除いて他の鍵を保つ',()=>{const h=['node:2','retain:none'];assert.deepEqual(validate(replayBstDelete('leaf',h).state.nodes),initial.filter(x=>x!==2));assert.equal(replayBstDelete('leaf',h).done,true);assert.equal(replayBstDelete('leaf',[...h,'node:4']),null);});
test('子１つの札を子でつなぎ直す',()=>{const p=replayBstDelete('single',['node:9']);assert.equal(p.state.nodes[9].right,9.5);assert.equal(replayBstDelete('single',['node:9','retain:none']),null);const q=replayBstDelete('single',['node:9','retain:9.5']);assert.equal(q.state.nodes[10].left,9.5);assert.deepEqual(validate(q.state.nodes),initial.filter(x=>x!==9));});
test('後継を写し、後継の右の子も残す',()=>{const h=['node:8','node:9','copy'];const p=replayBstDelete('two',JSON.parse(JSON.stringify(h)));assert.equal(p.state.nodes[8].key,9);assert.equal(p.state.nodes[9].key,9);assert.equal(replayBstDelete('two',[...h,'retain:none']),null);const q=replayBstDelete('two',[...h,'retain:9.5']);assert.equal(q.state.nodes[10].left,9.5);assert.deepEqual(validate(q.state.nodes),initial.filter(x=>x!==8));});
test('誤った節・順序・破損した履歴は拒否する',()=>{for(const h of [['copy'],['node:4'],['node:8','node:10'],['node:8','node:9','retain:9.5'],['node:8','node:9','copy','retain:9']])assert.equal(replayBstDelete('two',h),null,JSON.stringify(h));assert.equal(replayBstDelete('two',{}),null);assert.equal(replayBstDelete('unknown',[]),null);});
