import test from 'node:test';
import assert from 'node:assert/strict';
import {raModes,raFlags,raData,raAllowed,raCreate,raDone,raComplete,raRestore} from '../src/release-acquire.js';

test('release/acquire excludes the old data only when the acquire reads the release flag',()=>{
 for(const mode of raModes)for(const flag of raFlags)for(const data of raData)assert.equal(raAllowed(mode,flag,data),!(mode==='release-acquire'&&flag===1&&data===0));
 // Independently enumerate sequentially consistent interleavings of the two thread orders.
 const observed=new Set();function visit(a,b,data,flag,readFlag,readData){if(a===2&&b===2){observed.add(`${readFlag}:${readData}`);return;}if(a<2)visit(a+1,b,a===0?42:data,a===1?1:flag,readFlag,readData);if(b<2)visit(a,b+1,data,flag,b===0?flag:readFlag,b===1?data:readData);}visit(0,0,0,0,null,null);
 assert.deepEqual([...observed].sort(),['0:0','0:42','1:42']);assert.equal(raAllowed('relaxed',1,0),true);
});
test('all eight checked observations and a reflection are required and drafts are independent',()=>{
 const s=raCreate();for(const mode of raModes)for(const flag of raFlags)for(const data of raData){const key=`${mode}:${flag}:${data}`,answer=raAllowed(mode,flag,data)?'possible':'impossible';s.trials[key]={answer,checked:true};assert.equal(raDone(mode,flag,data,s.trials[key]),true);}assert.equal(raComplete(s),false);s.reflection='reads-from';assert.equal(raComplete(s),true);const copy=raRestore(s);copy.trials['relaxed:1:0'].answer='impossible';assert.equal(raComplete(copy),false);assert.equal(raComplete(s),true);copy.trials['relaxed:1:0'].checked=1;assert.throws(()=>raRestore(copy));
});
