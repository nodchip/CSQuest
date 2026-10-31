import test from 'node:test';
import assert from 'node:assert/strict';
import {links,starts,HOP_LIMIT,createPacket,forwardPacket,createForwarding,restoreForwarding,forwardingComplete} from '../src/forwarding.js';
function run(table,start){let packet=createPacket(start);while(packet.status==='traveling')packet=forwardPacket(table,packet);return packet;}
function cheapest(node,seen=[]){if(node==='G')return 0;const paths=Object.entries(links[node]).filter(([next])=>!seen.includes(next)).map(([next,cost])=>cost+cheapest(next,[...seen,node]));return Math.min(...paths);}
test('routing loops stop at the hop limit and an optimal table delivers from each tower',()=>{
  const loop=run({S:'B',A:'G',B:'S'},'S');assert.equal(loop.status,'expired');assert.equal(loop.hops,HOP_LIMIT);assert.deepEqual(loop.path,['S','B','S','B','S','B']);
  const table={S:'A',A:'G',B:'A'};for(const id of Object.keys(starts)){const result=run(table,id);assert.equal(result.status,'delivered');assert.equal(result.cost,cheapest(id));assert.equal(starts[id].best,cheapest(id));}
});
test('all routing tables report success only if every start reaches its shortest route',()=>{
  for(const s of Object.keys(links.S))for(const a of Object.keys(links.A))for(const b of Object.keys(links.B)){
    const state=createForwarding();state.table={S:s,A:a,B:b};for(const id of Object.keys(starts))state.states[id]=run(state.table,id);
    const independently=Object.keys(starts).every(id=>state.states[id].status==='delivered'&&state.states[id].cost===cheapest(id));
    assert.equal(forwardingComplete(state),independently);assert.equal(independently,s==='A'&&a==='G'&&b==='A');
  }
});
test('packet progress restores by replay and cannot pass a terminal state',()=>{
  const saved={selected:'S',table:{S:'A',A:'G',B:'A'},hops:{S:1,A:0,B:0}},restored=restoreForwarding(saved);
  assert.deepEqual(restored.states.S.path,['S','A']);
  assert.throws(()=>restoreForwarding({...saved,hops:{S:3,A:0,B:0}}),RangeError);
  assert.throws(()=>restoreForwarding({...saved,table:{S:'G',A:'G',B:'A'}}),RangeError);
});
