import {test} from 'node:test';
import assert from 'node:assert/strict';
import {crossProducts,crossMachines,crossRequired,crossCanRun,crossCreate,crossBuild,crossCheck,crossComplete,crossRestore} from '../src/cross-target.js';

test('native targets and bytecode VM compatibility are independent',()=>{
 const expected={nativeA:[true,false,false,false],nativeB:[false,true,true,true],bytecode:[true,true,false,false]};for(const p of Object.keys(crossProducts))assert.deepEqual(Object.keys(crossMachines).map(m=>crossCanRun(p,m)),expected[p]);assert.throws(()=>crossCanRun('unknown','forge'));assert.throws(()=>crossCanRun('nativeA','unknown'));
});
test('building and correct checks for required cases and reflection are necessary',()=>{
 const q=crossCreate();q.trials.nativeA.forge.guess=true;assert.equal(crossCheck(q),false);for(const [p,m] of crossRequired){q.product=p;q.machine=m;crossBuild(q);const t=q.trials[p][m];t.guess=!crossCanRun(p,m);assert.equal(crossCheck(q),false);t.guess=crossCanRun(p,m);assert.equal(crossCheck(q),true);assert.deepEqual(crossRestore(q),q);}assert.equal(crossComplete(q),false);q.answer='target';assert.equal(crossComplete(q),true);const bad=structuredClone(q);bad.built.nativeA=false;assert.throws(()=>crossRestore(bad));bad.built.nativeA=true;bad.trials.nativeA.forge.guess=false;assert.throws(()=>crossRestore(bad));const copy=crossRestore(q);copy.trials.nativeA.forge.checked=false;assert.equal(q.trials.nativeA.forge.checked,true);
});
