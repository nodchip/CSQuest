import test from 'node:test';
import assert from 'node:assert/strict';
import {vectorCreate,vectorAdd,vectorRemove,vectorReplicate,vectorPackage,vectorOpen,vectorAppend,vectorIndex,vectorComplete,vectorRestore} from '../src/dependent-vectors.js';

test('dependent replication and concatenation preserve each actual length and content',()=>{
 for(let n=0;n<=3;n++)for(const stone of ['moon','star']){const s=vectorCreate();s.count=n;s.stone=stone;for(let t=0;t<=3;t++){s.repLength=t;const r=vectorReplicate(s);assert.equal(r.ok,t===n);if(r.ok)assert.deepEqual(r.items,Array(n).fill(stone));}}
 for(let n=0;n<=3;n++)for(let m=0;m<=3;m++){const s=vectorCreate();s.left=Array(n).fill('moon');s.right=Array(m).fill('star');for(let guess=0;guess<=6;guess++){s.resultLength=guess;const r=vectorAppend(s);assert.equal(r.ok,guess===n+m);if(r.ok)assert.deepEqual(r.items,[...s.left,...s.right]);}}
});
test('dependent packages enforce the witness and bounded indices return only existing stones',()=>{
 for(let n=0;n<=3;n++){const s=vectorCreate();s.left=Array.from({length:n},(_,i)=>i%2?'star':'moon');for(let w=0;w<=3;w++){s.witness=w;const result=vectorPackage(s);assert.equal(result.ok,w===n);if(result.ok){const pack=vectorOpen(s);assert.equal(pack.length,n);assert.deepEqual(pack.items,s.left);s.left.push('star');assert.equal(s.pack.items.length,n);s.left.pop();}}for(let i=1;i<=4;i++){s.index=i;const r=vectorIndex(s);assert.equal(r.ok,i<=n);if(r.ok)assert.equal(r.item,s.left[i-1]);}}
});
test('completion requires each observation and valid independent restoration',()=>{
 const s=vectorCreate();assert.equal(vectorRemove(s,'left'),false);s.repLength=0;vectorReplicate(s);s.count=2;s.repLength=2;vectorReplicate(s);s.count=3;s.repLength=3;vectorReplicate(s);s.witness=1;assert.equal(vectorPackage(s).ok,false);s.witness=0;vectorPackage(s);vectorOpen(s);assert.ok(vectorAdd(s,'left','moon'));s.witness=1;vectorPackage(s);s.resultLength=1;vectorAppend(s);vectorAdd(s,'right','star');s.resultLength=2;vectorAppend(s);s.index=1;vectorIndex(s);s.index=4;vectorIndex(s);s.answer='depends';s.checked=true;assert.ok(vectorComplete(s));const copy=vectorRestore(s);copy.pack.items.pop();assert.equal(s.pack.items.length,1);assert.throws(()=>vectorRestore({...s,pack:{length:2,items:['moon']}}));assert.throws(()=>vectorRestore({...s,index:0}));
});
