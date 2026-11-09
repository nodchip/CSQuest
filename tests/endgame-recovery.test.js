import test from 'node:test';
import assert from 'node:assert/strict';
import {trusted,oneError,twoErrors,evenParity,replayRecovery} from '../src/endgame-recovery.js';

test('even parity detects one flip but not two; it does not locate the error',()=>{
 assert.equal(evenParity(trusted),true);assert.equal(evenParity(oneError),false);assert.equal(evenParity(twoErrors),true);
 for(let i=0;i<4;i++){const a=[...trusted];a[i]=!a[i];assert.equal(evenParity(a),false);}
 assert.equal(evenParity([true]),false);
});
test('hold, trusted comparison, verification and release are distinct',()=>{
 assert.equal(replayRecovery(['inspect','release']),null);
 assert.equal(replayRecovery(['inspect','hold','verify']),null);
 assert.equal(replayRecovery(['inspect','hold','flip:1','verify']),null);
 const h=['inspect','hold','flip:0','verify','release','inspect','uncertain'];
 assert.equal(replayRecovery(h).done,true);assert.deepEqual(replayRecovery(h).lamps,trusted);
 assert.equal(replayRecovery([...h,'inspect']),null);
});
