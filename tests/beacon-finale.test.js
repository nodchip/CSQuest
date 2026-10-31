import test from 'node:test';
import assert from 'node:assert/strict';
import {beaconTiles,beaconReach,beaconSolved,beaconSymbol,createBeacon,restoreBeacon} from '../src/beacon-finale.js';
test('both exits must connect to the source through reciprocal links',()=>{const s=createBeacon();assert.equal(beaconSolved(s),false);s.rotations=[0,0,0,0,0,0,0];assert.deepEqual([beaconReach(s.rotations).top,beaconReach(s.rotations).bottom],[true,true]);s.rotations[4]=1;assert.deepEqual([beaconReach(s.rotations).top,beaconReach(s.rotations).bottom],[true,false]);});
test('all rotations have symbols and saved success is accepted only for a solved network',()=>{for(const tile of beaconTiles)for(let n=0;n<4;n++)assert.ok(beaconSymbol(tile,n));const s=createBeacon();assert.throws(()=>restoreBeacon({...s,solved:true}));s.rotations.fill(0);s.solved=true;assert.deepEqual(restoreBeacon(s),s);assert.notEqual(restoreBeacon(s).rotations,s.rotations);});
