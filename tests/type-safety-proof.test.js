import test from 'node:test';
import assert from 'node:assert/strict';
import {proofStages,proofCreate,proofTry,proofComplete,proofRestore} from '../src/type-safety-proof.js';

test('every induction case rejects incorrect steps and resumes the guided proof',()=>{
 let s=proofCreate();for(const [i,stage] of proofStages.entries()){assert.equal(s.stage,i);assert.equal(stage.choices.length,3);assert.ok(stage.why);assert.equal(proofTry(s).stage,i);for(let choice=0;choice<3;choice++){const next=proofTry({...s,choice});if(choice===stage.correct){assert.equal(next.stage,i+1);assert.equal(next.message,stage.why);}else{assert.equal(next.stage,i);assert.ok(next.message);}}s=proofTry({...s,choice:stage.correct});s=proofRestore(s);}
 assert.ok(proofComplete(s));assert.throws(()=>proofRestore({...s,choice:0}));assert.throws(()=>proofRestore({...s,stage:-1}));
});
