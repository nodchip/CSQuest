import test from 'node:test';
import assert from 'node:assert/strict';
import {energyCases,energyResult,createEnergyLab,restoreEnergyLab} from '../src/energy-lab.js';
import {tradeoffCreate,tradeoffRestore} from '../src/compile-tradeoff.js';
test('energy is time multiplied by average power in each fixed case',()=>{assert.deepEqual(energyResult('first'),{quick:6,optimized:3,fastest:'quick',lowest:'optimized'});assert.deepEqual(energyResult('second'),{quick:4,optimized:6,fastest:'quick',lowest:'quick'});for(const key of Object.keys(energyCases)){const c=energyCases[key],r=energyResult(key);assert.equal(r.quick,c.quick.seconds*c.quick.watts);assert.equal(r.optimized,c.optimized.seconds*c.optimized.watts);}assert.throws(()=>energyResult('bad'));});
test('old saves gain independent energy records and invalid histories are rejected',()=>{const q=tradeoffCreate();delete q.energy;assert.deepEqual(tradeoffRestore(q).energy,createEnergyLab());const e=createEnergyLab();e.seen.push('first');const copy=restoreEnergyLab(e);copy.seen.push('second');assert.deepEqual(e.seen,['first']);assert.throws(()=>restoreEnergyLab({...e,seen:['first','first']}));});
