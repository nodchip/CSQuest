import test from 'node:test';import assert from 'node:assert/strict';import {replayInstructionHazard} from '../src/endgame-instruction-hazard.js';
const ticks=n=>Array(n).fill('tick');
test('independent expected old-value, stall and forwarding outcomes',()=>{
 for(const [mode,cycles,blue,stalls,forwarded] of [['unsafe',4,1,0,false],['stall',5,3,1,false],['forward',4,3,0,true]]){const p=replayInstructionHazard(mode,[...ticks(cycles),`answer:${blue}`]);assert.deepEqual([p.state.cycle,p.state.red,p.state.blue,p.state.stalls,p.state.forwarded,p.done],[cycles,2,blue,stalls,forwarded,true]);}
});
test('premature, wrong, extra and post-completion histories are rejected',()=>{
 for(const [k,h] of [['unsafe',['answer:1']],['unsafe',[...ticks(4),'answer:3']],['stall',[...ticks(5),'tick']],['forward',[...ticks(4),'answer:3','reset']],['unsafe',['bad']]])assert.equal(replayInstructionHazard(k,h),null);
 assert.equal(replayInstructionHazard('stall',['tick','reset']).state.cycle,0);
});
test('each cycle records the actual stage assignments and operand',()=>{
 const expected={unsafe:[[1,0,null,null],[null,1,0,null],[null,null,1,0],[null,null,null,null]],stall:[[1,0,null,null],[null,1,0,null],[null,1,null,null],[null,null,1,2],[null,null,null,null]],forward:[[1,0,null,null],[null,1,0,null],[null,null,1,2],[null,null,null,null]]};
 for(const [kind,rows] of Object.entries(expected)) assert.deepEqual(replayInstructionHazard(kind,rows.map(()=> 'tick')).trace.map(t=>[t.fetch,t.decode,t.execute,t.operand]),rows,kind);
});
