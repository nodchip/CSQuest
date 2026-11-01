import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {coinTransactions,coinBody,runCoinLedger,createCoinLedger,coinLedgerComplete,restoreCoinLedger} from '../src/coin-ledger.js';
test('forgery, valid transfer, conflicting spend and onward transfer use real ECDSA verification',async()=>{
 const r=await runCoinLedger(webcrypto.subtle,['forge','mr','mn','rn']);
 assert.deepEqual(r.results.map(x=>x.status),['signature','accepted','spent','accepted']);
 assert.deepEqual(r.results.map(x=>x.verified),[false,true,null,true]);
 assert.deepEqual(r.unspent,[{id:'rn',owner:'nono'}]);
 const other=await runCoinLedger(webcrypto.subtle,['rn','mn','mr']);
 assert.deepEqual(other.results.map(x=>x.status),['missing','accepted','spent']);
 assert.deepEqual(other.unspent,[{id:'mn',owner:'nono'}]);
 await assert.rejects(runCoinLedger(null,[]));
});
test('signature covers both input and recipient of the fixed transfer body',async()=>{
 const s=webcrypto.subtle,pair=await s.generateKey({name:'ECDSA',namedCurve:'P-256'},false,['sign','verify']),params={name:'ECDSA',hash:'SHA-256'},tx=coinTransactions.mr;
 const signature=await s.sign(params,pair.privateKey,coinBody(tx));
 assert.equal(await s.verify(params,pair.publicKey,signature,coinBody(tx)),true);
 assert.equal(await s.verify(params,pair.publicKey,signature,coinBody({...tx,recipient:'nono'})),false);
 assert.equal(await s.verify(params,pair.publicKey,signature,coinBody({...tx,input:'other'})),false);
});
test('completion requires all observations, valid restoration and reflection',()=>{
 const s=createCoinLedger();s.observed=['forge','mr','mn','rn','spent'];s.answer='both';s.checked=true;assert.ok(coinLedgerComplete(restoreCoinLedger(s)));
 assert.throws(()=>restoreCoinLedger({...s,history:['bogus']}));assert.throws(()=>restoreCoinLedger({...s,observed:['mr','mr']}));
});
