import test from 'node:test';
import assert from 'node:assert/strict';
import {wordDocuments,createWordIndex,restoreWordIndex} from '../src/word-index.js';
import {frequencyVector,vectorSimilarity,createWordVectorExercise,restoreWordVectorExercise} from '../src/word-vectors.js';

test('word counts yield the expected exact distances and cosine edge case',()=>{
 assert.deepEqual(Object.values(wordDocuments).map(frequencyVector),[[1,1],[2,0],[0,0],[0,0]]);
 const a=vectorSimilarity([1,1],[1,1]),b=vectorSimilarity([2,0],[1,1]),c=vectorSimilarity([0,0],[1,1]);
 assert.equal(a.distance,0);assert.ok(Math.abs(a.cosine-1)<1e-12);
 assert.ok(Math.abs(b.distance-Math.SQRT2)<1e-12);assert.ok(Math.abs(b.cosine-1/Math.SQRT2)<1e-12);
 assert.equal(c.cosine,null);assert.ok(Math.abs(c.distance-Math.SQRT2)<1e-12);
 assert.equal(vectorSimilarity([1,1],[0,0]).cosine,null);
 assert.throws(()=>vectorSimilarity([1],[1,1]));
});
test('old drafts restore unanswered and new choices are copied',()=>{
 const old=createWordIndex();delete old.vectors;assert.deepEqual(restoreWordIndex(old).vectors,createWordVectorExercise());
 old.vectors={nearest:'a',zero:'undefined',checked:true};const restored=restoreWordIndex(old);assert.deepEqual(restored.vectors,old.vectors);restored.vectors.checked=false;assert.equal(old.vectors.checked,true);
 assert.throws(()=>restoreWordVectorExercise({nearest:null,zero:'undefined',checked:true}));
});
