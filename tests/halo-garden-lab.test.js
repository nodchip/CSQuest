import test from 'node:test';
import assert from 'node:assert/strict';
import {lifeNext} from '../src/life-garden.js';
import {haloGardenResultCells,createHaloLab,advanceHaloLab,createHaloGarden,restoreHaloGarden} from '../src/halo-garden.js';
test('edited patterns match whole-board next generation when shared and can expose missing boundaries',()=>{const cells=[11,12,13];assert.deepEqual(haloGardenResultCells(cells,true).actual,lifeNext(cells));assert.equal(haloGardenResultCells(cells,false).match,false);assert.equal(haloGardenResultCells([],false).match,true);const s=createHaloLab();assert.throws(()=>advanceHaloLab(s));s.ran=true;const next=advanceHaloLab(s);assert.deepEqual(next.cells,[7,12,17]);assert.equal(next.generation,1);assert.equal(next.ran,false);});
test('lab state round-trips, validates cells and loads older drafts',()=>{const s=createHaloGarden();s.lab={cells:[0,6,12],shared:false,ran:true,generation:2};assert.deepEqual(restoreHaloGarden(s),s);delete s.lab;assert.deepEqual(restoreHaloGarden(s).lab,createHaloLab());s.lab={cells:[2,2],shared:true,ran:false,generation:0};assert.throws(()=>restoreHaloGarden(s));});
