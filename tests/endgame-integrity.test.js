import test from 'node:test';
import assert from 'node:assert/strict';
import {integrityCases,applyIntegrity,replayIntegrity} from '../src/endgame-integrity.js';

test('unique keys and referenced destinations permit only the safe requested changes',()=>{
 const actions=['parcel:B:20','destination:30','delete:20'];
 assert.equal(replayIntegrity(actions).done,true);
 assert.equal(replayIntegrity([...actions,'delete:10']),null);
});
test('a missing destination, duplicate key and referenced deletion are rejected',()=>{
 assert.equal(replayIntegrity(['parcel:C:30']),null);
 assert.equal(replayIntegrity(['parcel:B:20','destination:10']),null);
 assert.equal(replayIntegrity(['parcel:B:20','destination:30','delete:10']),null);
 assert.equal(applyIntegrity(integrityCases[0],'parcel:C:30').ok,false);
 assert.equal(applyIntegrity(integrityCases[0],'parcel:A:20').ok,false);
 assert.equal(applyIntegrity(integrityCases[1],'destination:10').ok,false);
 assert.equal(applyIntegrity(integrityCases[2],'delete:10').ok,false);
 assert.deepEqual(applyIntegrity(integrityCases[2],'delete:20').destinations,[10]);
});
