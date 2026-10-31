import test from 'node:test';
import assert from 'node:assert/strict';
import {morphSequenceCases,morphTransform,morphTarget,morphCurrent,morphSequenceCorrect,createMorphSequence,restoreMorphSequence,morphSequenceComplete} from '../src/morph-sequence.js';
test('opening removes the isolated point and closing fills the central hole in these fixtures',()=>{
 const opening=morphCurrent('noise',['erode','dilate']);assert.deepEqual(opening,morphTarget('noise'));assert.equal(opening.flat().reduce((a,b)=>a+b,0),5);assert.equal(opening[0][0],0);const closing=morphCurrent('hole',['dilate','erode']);assert.deepEqual(closing,morphTarget('hole'));assert.equal(closing.flat().reduce((a,b)=>a+b,0),9);assert.equal(closing[3][3],1);
});
test('all two-step orders distinguish the requested goals and valid drafts are copied',()=>{
 for(const [id,expected] of [['noise','erode,dilate'],['hole','dilate,erode']]){const matches=[];for(const a of ['erode','dilate'])for(const b of ['erode','dilate'])if(morphSequenceCorrect(id,{history:[a,b],checked:true}))matches.push(`${a},${b}`);assert.deepEqual(matches,[expected]);}
 const s=createMorphSequence();s.choices.noise={history:['erode','dilate'],checked:true};s.choices.hole={history:['dilate','erode'],checked:true};assert.equal(morphSequenceComplete(s),true);const copy=restoreMorphSequence(s);s.choices.noise.history.pop();assert.equal(copy.choices.noise.history.length,2);copy.choices.hole.history=['bad'];assert.throws(()=>restoreMorphSequence(copy),RangeError);assert.throws(()=>morphTransform(morphSequenceCases.noise.image,'bad'),RangeError);
});
