import test from 'node:test';
import assert from 'node:assert/strict';
import {allocationFree,allocationModes,hasContiguousSpace,createAllocation,createAllocationTrial,allocationPick,allocationTrialPass,allocationComplete,restoreAllocation} from '../src/file-allocation.js';

test('contiguous-space check agrees with all 256 eight-slot configurations',()=>{
 for(let mask=0;mask<256;mask++){const free=Array.from({length:8},(_,i)=>i).filter(i=>mask&(1<<i));for(let size=1;size<=8;size++){let expected=false;for(let start=0;start+size<=8;start++){let full=true;for(let i=start;i<start+size;i++)if(!(mask&(1<<i)))full=false;if(full)expected=true;}assert.equal(hasContiguousSpace(free,size),expected);}}
 assert.equal(hasContiguousSpace(allocationFree,3),false);
});
test('all selectable allocation orders are distinct and require the correct read count',()=>{
 for(const [mode,m] of Object.entries(allocationModes)){let count=0;function visit(t){if(t.selected.length===m.size){count++;assert.equal(new Set(t.selected).size,m.size);assert.equal(allocationTrialPass({...t,guess:m.reads,checked:true},mode),true);assert.equal(allocationTrialPass({...t,guess:m.reads===3?2:3,checked:true},mode),false);return;}for(const slot of allocationFree)if(!t.selected.includes(slot))visit(allocationPick(t,mode,slot));}visit(createAllocationTrial());assert.equal(count,mode==='linked'?60:120);}
});
test('completion and restoration require valid independent trials',()=>{
 const s=createAllocation();s.noRoom=true;for(const [k,m] of Object.entries(allocationModes)){for(const n of allocationFree.slice(0,m.size))s.trials[k]=allocationPick(s.trials[k],k,n);s.trials[k].guess=m.reads;s.trials[k].checked=true;}s.answer='tradeoff';s.checked=true;const r=restoreAllocation(s);assert.equal(allocationComplete(r),true);r.trials.linked.selected.pop();assert.equal(s.trials.linked.selected.length,3);assert.throws(()=>restoreAllocation({...s,trials:{...s.trials,linked:{selected:[0,0,2],guess:3,checked:true}}}));assert.throws(()=>restoreAllocation({...s,trials:{...s.trials,indexed:{selected:[0],guess:2,checked:true}}}));
});
