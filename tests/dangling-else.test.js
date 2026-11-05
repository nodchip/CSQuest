import test from 'node:test';
import assert from 'node:assert/strict';
import {danglingResult,createDangling,restoreDangling} from '../src/dangling-else.js';
import {railCreate,railRestore} from '../src/syntax-rail.js';
test('C nearest else and explicit outer braces give the expected four outputs each',()=>{assert.deepEqual([false,true].flatMap(x=>[false,true].map(y=>danglingResult('inner',x,y))),['none','none','b','a']);assert.deepEqual([false,true].flatMap(x=>[false,true].map(y=>danglingResult('outer',x,y))),['b','b','none','a']);assert.throws(()=>danglingResult('outer',0,true));});
test('old drafts migrate and valid partial evidence restores independently',()=>{const q=railCreate();delete q.dangling;assert.deepEqual(railRestore(q).dangling,createDangling());const d=createDangling();d.seen=['inner:true:false'];const t=restoreDangling(d);t.seen.push('outer:false:true');assert.equal(d.seen.length,1);assert.throws(()=>restoreDangling({...d,seen:['other']}));});
