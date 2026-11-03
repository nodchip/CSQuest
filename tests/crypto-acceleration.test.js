import test from 'node:test';
import assert from 'node:assert/strict';
import {cryptoAccelModes,cryptoAccelSizes,cryptoAccelKeys,cryptoAccelEstimate,cryptoAccelCreate,cryptoAccelRestore,cryptoAccelDone} from '../src/crypto-acceleration.js';
test('each method and batch size includes the stated preparation and block costs',()=>{
 const expected={software:[[0,45,45],[0,45,360],[0,45,720]],instructions:[[0,20,20],[0,20,160],[0,20,320]],device:[[100,8,108],[100,8,164],[100,8,228]]};
 for(const mode of Object.keys(cryptoAccelModes))for(const [i,n] of cryptoAccelSizes.entries()){const r=cryptoAccelEstimate(mode,n);assert.deepEqual([r.setup,r.perBlock,r.total],expected[mode][i]);}
 assert.throws(()=>cryptoAccelEstimate('constructor',1));assert.throws(()=>cryptoAccelEstimate('device',0));
});
test('fastest method depends on the batch and all nine observations and conclusions are required',()=>{
 for(const [n,mode] of [[1,'instructions'],[8,'instructions'],[16,'device']])assert.equal(Object.keys(cryptoAccelModes).sort((a,b)=>cryptoAccelEstimate(a,n).total-cryptoAccelEstimate(b,n).total)[0],mode);
 const q=cryptoAccelCreate();q.seen=[...cryptoAccelKeys];q.choice='device';q.security='authentication';assert.equal(cryptoAccelDone(q),true);for(const k of cryptoAccelKeys)assert.equal(cryptoAccelDone({...q,seen:q.seen.filter(x=>x!==k)}),false);assert.equal(cryptoAccelDone({...q,security:'automatic'}),false);assert.equal(cryptoAccelDone({...q,choice:'instructions'}),false);
});
test('restoration copies state and rejects bad markers and guesses',()=>{
 const q=cryptoAccelCreate();q.seen=['device:16'];const r=cryptoAccelRestore(q);r.seen.pop();assert.deepEqual(q.seen,['device:16']);assert.throws(()=>cryptoAccelRestore({...q,seen:['device:16','device:16']}));assert.throws(()=>cryptoAccelRestore({...q,seen:['device:4']}));assert.throws(()=>cryptoAccelRestore({...q,guess:100}));
});
