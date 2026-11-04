import {test} from 'node:test';
import assert from 'node:assert/strict';
import {unicodeSearchRun,unicodeSearchTrace,unicodeSearchCreate,unicodeSearchCheck,unicodeSearchDone,unicodeSearchRestore} from '../src/unicode-title-search.js';
test('canonical normalization and locale-specific lowercasing affect distinct sets of titles',()=>{assert.deepEqual(unicodeSearchRun('decomposed','raw'),[]);assert.deepEqual(unicodeSearchRun('decomposed','nfc'),['lower']);assert.deepEqual(unicodeSearchRun('decomposed','lower'),['lower','upper']);assert.deepEqual(unicodeSearchRun('upper','raw'),['upper']);assert.deepEqual(unicodeSearchRun('upper','nfc'),['upper']);assert.deepEqual(unicodeSearchRun('upper','lower'),['lower','upper']);});
test('correct predictions for six comparisons and reflection are required',()=>{const q=unicodeSearchCreate();for(const query of ['decomposed','upper'])for(const mode of ['raw','nfc','lower']){q.query=query;q.mode=mode;const count=unicodeSearchRun(query,mode).length;q.guess=count===0?1:0;assert.equal(unicodeSearchCheck(q).ok,false);q.guess=count;assert.equal(unicodeSearchCheck(q).ok,true);}assert.equal(unicodeSearchDone(q),false);q.reflection='requirements';q.checked=true;assert.equal(unicodeSearchDone(q),true);const copy=unicodeSearchRestore(q);copy.seen.pop();assert.equal(q.seen.length,6);assert.throws(()=>unicodeSearchRestore({...q,seen:['upper:raw','upper:raw']}));});
test('comparison trace shows the actual transformed code points and matches',()=>{
 const raw=unicodeSearchTrace('decomposed','raw');
 assert.deepEqual(raw.needle,['U+0063','U+0061','U+0066','U+0065','U+0301']);
 assert.deepEqual(raw.docs[0].points,['U+0063','U+0061','U+0066','U+00E9']);
 assert.equal(raw.docs[0].matches,false);
 const normalized=unicodeSearchTrace('decomposed','nfc');
 assert.deepEqual(normalized.needle,normalized.docs[0].points);
 assert.equal(normalized.docs[0].matches,true);
 const lowercased=unicodeSearchTrace('upper','lower');
 assert.deepEqual(lowercased.needle,lowercased.docs[0].points);
 assert.equal(lowercased.docs[1].matches,true);
 assert.equal(lowercased.docs[2].matches,false);
 assert.throws(()=>unicodeSearchTrace('unknown','raw'));
});
