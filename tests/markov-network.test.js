import test from 'node:test';
import assert from 'node:assert/strict';
import {markovWeight,createMarkovNetwork,markovCorrect,markovNetworkComplete,restoreMarkovNetwork} from '../src/markov-network.js';
import {restoreElimination} from '../src/variable-elimination.js';

test('all eight edge products normalize to 32 and separate X and Z given Y',()=>{
 const expected=[9,3,1,3,3,1,3,9];
 assert.deepEqual(expected.map((_,i)=>markovWeight(i)),expected);
 assert.equal(expected.reduce((a,b)=>a+b,0),32);
 for(const y of [0,1]){
  const w=(x,z)=>expected[x+2*y+4*z];
  assert.equal(w(0,0)*w(1,1),w(0,1)*w(1,0));
 }
 const s=createMarkovNetwork();s.answers=[...expected];s.checked=Array(8).fill(true);s.reflection='potential';s.finished=true;
 assert.equal(markovNetworkComplete(s),true);
 s.answers[2]=3;assert.equal(markovCorrect(s,2),false);assert.equal(markovNetworkComplete(s),false);
 const copy=restoreMarkovNetwork(s);copy.answers[0]=1;assert.equal(s.answers[0],9);
 assert.throws(()=>restoreMarkovNetwork({...s,answers:[1]}));
});
test('previous elimination drafts gain a fresh undirected example',()=>{
 const old={selected:'A',histories:{A:[],B:[]},guess:null,answer:null,checked:false};
 assert.deepEqual(restoreElimination(old).markov,createMarkovNetwork());
});
