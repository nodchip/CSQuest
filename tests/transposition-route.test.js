import test from 'node:test';
import assert from 'node:assert/strict';
import {transposeCases,transpose,transposeKeys,transposeMatches,transposeCorrect,transposeCreate,transposeDone,transposeComplete,transposeRestore} from '../src/transposition-route.js';

test('all 24 orders preserve the symbols and repeated columns make two orders indistinguishable',()=>{
 const keys=transposeKeys();assert.equal(keys.length,24);assert.equal(new Set(keys.map(key=>key.join(''))).size,24);
 for(const c of Object.values(transposeCases))for(const key of keys)assert.deepEqual(transpose(c.rows,key).sort(),c.rows.flat().sort());
 assert.equal(transpose(transposeCases.unique.rows,[2,0,3,1]).join(''),'木風火月土海水星');
 assert.deepEqual(transposeMatches('unique'),[[2,0,3,1]]);
 assert.deepEqual(transposeMatches('duplicate'),[[0,2,3,1],[2,0,3,1]]);
 assert.equal(transposeCorrect('duplicate',[0,0,3,1]),false);
});
test('matching orders, inspection, correct count and reflection are required',()=>{
 const s=transposeCreate();for(const [id,answer] of [['unique','one'],['duplicate','many']]){const t=s.trials[id];t.key=[2,0,3,1];t.answer=answer;t.checked=true;assert.equal(transposeDone(id,t),false);t.inspected=true;assert.equal(transposeDone(id,t),true);}
 assert.equal(transposeComplete(s),false);s.reflection='same';assert.equal(transposeComplete(s),true);
 const copy=transposeRestore(s);copy.trials.unique.key.push(1);assert.equal(s.trials.unique.key.length,4);assert.throws(()=>transposeRestore(copy));
});
