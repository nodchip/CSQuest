import test from 'node:test';
import assert from 'node:assert/strict';
import {shareValue,possibleSecrets,createSecretSharing,sharingTrial,sharingComplete,restoreSecretSharing} from '../src/secret-sharing.js';
test('every pair reconstructs all 121 possible secrets and slopes, each single share fits all secrets',()=>{
 for(let secret=0;secret<11;secret++)for(let slope=0;slope<11;slope++){
  const shares=[1,2,3].map(x=>({x,y:shareValue(secret,slope,x)}));
  for(const share of shares){const possible=possibleSecrets([share]);assert.equal(possible.length,11);assert.deepEqual(possible.map(p=>p.secret),Array.from({length:11},(_,i)=>i));}
  for(const [a,b] of [[0,1],[0,2],[1,2]])assert.deepEqual(possibleSecrets([shares[a],shares[b]]),[{secret,slope}]);
 }
 assert.throws(()=>possibleSecrets([{x:1,y:0},{x:1,y:1}]));
});
test('one share accepts a distinct compatible secret, pairs demand the original, and progress is validated',()=>{
 const s=createSecretSharing();s.made=true;s.selected=[1];s.guess=5;const trial=sharingTrial(s);assert.equal(trial.correct,true);assert.equal(shareValue(trial.alternative.secret,trial.alternative.slope,1),7);
 s.guess=4;assert.equal(sharingTrial(s).correct,false);s.selected=[1,3];s.guess=3;assert.equal(sharingTrial(s).correct,false);s.guess=4;assert.equal(sharingTrial(s).correct,true);
 s.single=true;s.pairs=['12','13','23'];s.answer='threshold';s.checked=true;assert.equal(sharingComplete(restoreSecretSharing(s)),true);
 assert.throws(()=>restoreSecretSharing({...s,pairs:['12','12']}));assert.throws(()=>restoreSecretSharing({...s,made:false}));
});
