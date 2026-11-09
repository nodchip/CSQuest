import test from 'node:test';
import assert from 'node:assert/strict';
import {fitImage,replayFit,replayPixels} from '../src/endgame-image.js';

test('same aspect ratio and square frame produce distinct geometric outcomes',()=>{
 for(const mode of ['contain','crop','stretch'])assert.deepEqual(fitImage(4,2,mode),{whole:true,full:true,shape:true});
 assert.deepEqual(fitImage(4,4,'contain'),{whole:true,full:false,shape:true});
 assert.deepEqual(fitImage(4,4,'crop'),{whole:false,full:true,shape:true});
 assert.deepEqual(fitImage(4,4,'stretch'),{whole:true,full:true,shape:false});
 assert.equal(fitImage(0,4,'crop'),null);
});
test('each scene checks properties rather than a fixed mode',()=>{
 assert.equal(replayFit(['stretch','run','run','crop','run','stretch','run']).done,true);
 assert.equal(replayFit(['run','crop','run']),null);
});
test('pixel art accepts exact columns, toggles correction and compares the two boards',()=>{
 const history=['cell:1','cell:0','cell:0','cell:5','run','cell:3','cell:11','cell:19','cell:27','run','narrow-eight'];
 assert.equal(replayPixels(history).done,true);
 assert.equal(replayPixels(['cell:1','run']),null);
 assert.equal(replayPixels(['cell:8']),null);
 assert.equal(replayPixels(['cell:1','cell:5','run','cell:3','cell:11','cell:19','cell:27','run','narrow-four']),null);
});
