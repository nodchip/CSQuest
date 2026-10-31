import test from 'node:test';
import assert from 'node:assert/strict';
import {captionModes,captionScenes,captionExpected,createCaptions,restoreCaptions,captionsComplete} from '../src/game-captions.js';

test('identical non-specific displays cannot distinguish the two actions',()=>{
 assert.notEqual(captionScenes.arrow.action,captionScenes.bridge.action);for(const mode of ['none','generic'])for(const scene of Object.keys(captionScenes))assert.equal(captionExpected(mode,scene),'unknown');assert.equal(captionExpected('specific','arrow'),'duck');assert.equal(captionExpected('specific','bridge'),'back');assert.throws(()=>captionExpected('unknown','arrow'),RangeError);
});
test('all six checked decisions are required and saved settings are validated',()=>{
 const s=createCaptions();for(const mode of Object.keys(captionModes))for(const scene of Object.keys(captionScenes))s.choices[mode][scene]={answer:captionExpected(mode,scene),checked:true};assert.equal(captionsComplete(s),true);const restored=restoreCaptions(s);s.choices.specific.arrow.answer='back';assert.equal(restored.choices.specific.arrow.answer,'duck');restored.choices.generic.bridge.checked=false;assert.equal(captionsComplete(restored),false);assert.throws(()=>restoreCaptions({...restored,mode:'other'}),RangeError);
});
