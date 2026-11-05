import test from 'node:test';
import assert from 'node:assert/strict';
import {flexResult,createFlexLab,restoreFlexLab} from '../src/collection-flex.js';
import {createTypeChecking,restoreTypeChecking} from '../src/type-checking.js';
test('fixed insertion and subsequent operation follow each stated policy',()=>{for(const action of ['inspect','sum']){assert.equal(flexResult('typed','text',action),'blocked');assert.equal(flexResult('guarded','text',action),'rejected');for(const mode of ['typed','open','guarded'])assert.equal(flexResult(mode,'number',action),'success');}assert.equal(flexResult('open','text','inspect'),'success');assert.equal(flexResult('open','text','sum'),'error');assert.throws(()=>flexResult('bad','text','sum'));});
test('old checking drafts gain independent collection progress',()=>{const q=createTypeChecking();delete q.flex;assert.deepEqual(restoreTypeChecking(q).flex,createFlexLab());const s=createFlexLab();s.seen=['open:text:inspect'];const c=restoreFlexLab(s);c.seen.push('open:text:sum');assert.equal(s.seen.length,1);assert.throws(()=>restoreFlexLab({...s,seen:['bad']}));});
