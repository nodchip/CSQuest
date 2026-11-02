import {test} from 'node:test';
import assert from 'node:assert/strict';
import {inclusiveSteps,cycleCreate,cycleStep,cycleComplete,cycleRestore} from '../src/inclusive-cycle.js';
test('each stage accepts its intended decision and preserves progress after wrong choices',()=>{const q=cycleCreate();for(const step of inclusiveSteps){for(const [id] of step.choices.filter(([id])=>id!==step.correct)){const before=structuredClone(q);assert.equal(cycleStep(q,id),false);assert.deepEqual(q,before);}assert.equal(cycleComplete(q),false);assert.equal(cycleStep(q,step.correct),true);assert.deepEqual(cycleRestore(q),q);}assert.equal(cycleComplete(q),true);assert.throws(()=>cycleStep(q,'invite'));});
test('invalid and fabricated progress cannot be restored',()=>{for(const history of [['finish'],['invite','color'],['invite','prototype','iterate','combine','invite']])assert.throws(()=>cycleRestore({history}));assert.throws(()=>cycleRestore({history:'invite'}));});
