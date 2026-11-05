import test from 'node:test';
import assert from 'node:assert/strict';
import {compareCases,compareChoices,mobileCompareCreate,mobileCompareCheck,mobileCompareDone,mobileCompareRestore} from '../src/mobile-general-compare.js';
import {mobilePlatformCreate,mobilePlatformRestore} from '../src/mobile-platform-choice.js';

test('each situation accepts only its stated response',()=>{
 const q=mobileCompareCreate();for(const [id,c] of Object.entries(compareCases)){q.caseId=id;for(const answer of Object.keys(compareChoices)){q.choice=answer;const before=q.seen.length;assert.equal(mobileCompareCheck(q),answer===c.answer);if(answer!==c.answer)assert.equal(q.seen.length,before);}}assert.equal(q.seen.length,3);assert(!mobileCompareDone(q));q.reflection='context';assert(mobileCompareDone(q));
});
test('drafts preserve comparisons and migrate previous records',()=>{
 const q=mobileCompareCreate();q.choice='common';mobileCompareCheck(q);const copy=mobileCompareRestore(q);copy.seen.pop();assert.deepEqual(q.seen,['common']);assert.throws(()=>mobileCompareRestore({...q,seen:['common','common']}));const {comparison,...old}=mobilePlatformCreate();assert.deepEqual(mobilePlatformRestore(old),mobilePlatformCreate());
});
