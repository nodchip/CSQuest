import test from 'node:test';
import assert from 'node:assert/strict';
import {simulatePages,createPageLab,runPageLab,restorePageLab,pageLabComplete,anomalySequence,localitySequence} from '../src/page-lab.js';

test('FIFO exhibits Belady anomaly while LRU and optimal do not on this sequence',()=>{
 const count=(n,p)=>simulatePages(anomalySequence,n,p).faults;
 assert.deepEqual([count(3,'fifo'),count(4,'fifo')],[9,10]);
 assert.ok(count(4,'lru')<=count(3,'lru'));assert.ok(count(4,'optimal')<=count(3,'optimal'));
 const last=simulatePages(anomalySequence,3,'fifo').steps.at(-1);assert.equal(last.faults,9);assert.equal(last.page,'E');
});
test('optimal agrees with exhaustive victim choices and LRU does not worsen with more frames',()=>{
 function best(a,capacity,frames=[],i=0){if(i===a.length)return 0;if(frames.includes(a[i]))return best(a,capacity,frames,i+1);if(frames.length<capacity)return 1+best(a,capacity,[...frames,a[i]],i+1);return 1+Math.min(...frames.map((_,j)=>best(a,capacity,frames.map((p,k)=>k===j?a[i]:p),i+1)));}
 function visit(seq){if(seq.length){for(const n of [3,4])assert.equal(simulatePages(seq,n,'optimal').faults,best(seq,n));assert.ok(simulatePages(seq,4,'lru').faults<=simulatePages(seq,3,'lru').faults);}if(seq.length<6)for(const p of ['A','B','C','D'])visit([...seq,p]);}visit([]);
});
test('FIFO and LRU agree with independent ordered-queue models',()=>{
 function reference(seq,capacity,policy){let queue=[],faults=0;for(const p of seq){const i=queue.indexOf(p);if(i<0){faults++;if(queue.length===capacity)queue.shift();queue.push(p);}else if(policy==='lru'){queue.splice(i,1);queue.push(p);}}return faults;}
 function visit(seq){if(seq.length)for(const n of [3,4])for(const policy of ['fifo','lru'])assert.equal(simulatePages(seq,n,policy).faults,reference(seq,n,policy));if(seq.length<6)for(const p of ['A','B','C','D'])visit([...seq,p]);}visit([]);
});
test('experiment requires both comparisons and restores a separate sequence',()=>{
 let s=createPageLab();assert.throws(()=>runPageLab(s));s.sequence=[...anomalySequence];s=runPageLab(s);assert.equal(s.anomalySeen,true);assert.equal(s.otherSeen,false);s.sequence=[...localitySequence];s=runPageLab(s);s.answer='depends';s.checked=true;assert.equal(pageLabComplete(s),true);const restored=restorePageLab(s);restored.sequence.pop();assert.equal(s.sequence.length,9);assert.throws(()=>restorePageLab({...s,sequence:['Z']}));
});
