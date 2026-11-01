import test from 'node:test';
import assert from 'node:assert/strict';
import {aesSbox} from '../src/aes-differential.js';
import {bitParity,linearInputs,linearRow,linearCandidates,linearExperiment,createAesLinear,aesLinearComplete,restoreAesLinear} from '../src/aes-linear.js';
const walshCounts=a=>{const v=Array(256);for(let x=0;x<256;x++)v[aesSbox[x]]=bitParity(x&a)?-1:1;for(let w=1;w<256;w*=2)for(let i=0;i<256;i+=2*w)for(let j=0;j<w;j++){const a=v[i+j],b=v[i+j+w];v[i+j]=a+b;v[i+j+w]=a-b;}return v.map(n=>(256+n)/2);};
test('linear counts match independent Walsh-Hadamard transform for every input mask',()=>{
 for(let a=0;a<256;a++){const expected=walshCounts(a),row=linearRow(a);assert.deepEqual(row,expected);if(a!==0)assert.ok(row.every(n=>Math.abs(n-128)<=16));}
});
test('zero masks and representative low, equal and high biases are distinct',()=>{
 assert.equal(linearExperiment(0,0).count,256);assert.equal(linearExperiment(0,1).count,128);
 for(const a of linearInputs.slice(1)){const counts=linearCandidates(a).map(b=>linearExperiment(a,b).count);assert.deepEqual([...counts].sort((x,y)=>x-y),[112,128,144]);}
});
test('required cases and saved choices are validated',()=>{
 const s=createAesLinear();s.tested=linearInputs.flatMap(a=>linearCandidates(a).filter(b=>a!==0||b===0).map(b=>`${a}:${b}`));s.answer='limited';s.checked=true;assert.ok(aesLinearComplete(restoreAesLinear(s)));
 assert.throws(()=>restoreAesLinear({...s,tested:['1:999']}));
});
