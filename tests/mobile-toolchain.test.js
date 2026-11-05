import test from 'node:test';
import assert from 'node:assert/strict';
import {toolchainCreate,toolchainMatches,toolchainStep,toolchainDone,toolchainRestore} from '../src/mobile-toolchain.js';
import {mobilePlatformCreate,mobilePlatformRestore} from '../src/mobile-platform-choice.js';

test('the two specified briefs accept only their requested pair',()=>{
 for(const platform of ['android','ios'])for(const language of ['kotlin','swift'])for(const environment of ['studio','xcode']){
  const q={...toolchainCreate(),platform,language,environment};const expected=platform==='android'?language==='kotlin'&&environment==='studio':language==='swift'&&environment==='xcode';assert.equal(toolchainMatches(q),expected);if(!expected)assert.throws(()=>toolchainStep(q));else{for(let i=0;i<3;i++)toolchainStep(q);assert.equal(q.phase,3);assert.deepEqual(q.seen,[platform]);assert.throws(()=>toolchainStep(q));}
 }
});
test('both plans and the reflection are needed, old drafts migrate',()=>{
 const q=toolchainCreate();q.language='kotlin';q.environment='studio';toolchainStep(q);const copy=toolchainRestore(q);copy.seen.push('ios');assert.equal(q.seen.length,0);assert.throws(()=>toolchainRestore({...q,language:'swift'}));toolchainStep(q);toolchainStep(q);q.platform='ios';q.language='swift';q.environment='xcode';q.phase=0;for(let i=0;i<3;i++)toolchainStep(q);assert(!toolchainDone(q));q.reflection='both';assert(toolchainDone(q));const {toolchain,...old}=mobilePlatformCreate();assert.deepEqual(mobilePlatformRestore(old),mobilePlatformCreate());
});
