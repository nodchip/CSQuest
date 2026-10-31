import test from 'node:test';
import assert from 'node:assert/strict';
import {gradientModes,gradientLoss,gradientSlope,gradientStep,createGradient,restoreGradient,gradientComplete} from '../src/gradient.js';

test('derivative agrees with a symmetric difference and both learning rates follow their expected paths',()=>{
 for(let w=0;w<=4;w+=0.25){const h=1e-5;assert.ok(Math.abs((gradientLoss(w+h)-gradientLoss(w-h))/(2*h)-gradientSlope(w))<1e-8);}
 const expected={small:[1,1.5,1.75,1.875],large:[4,0,4,0]};for(const id of Object.keys(gradientModes)){let state=createGradient().states[id];for(const next of expected[id]){const correct=gradientSlope(state.w)<0?'right':'left',wrong=correct==='right'?'left':'right';assert.equal(gradientStep(state,wrong).steps,state.steps);state=gradientStep(state,correct);assert.equal(state.w,next);}assert.throws(()=>gradientStep(state,'left'),RangeError);}
});
test('both completed trajectories are required and partial runs restore',()=>{
 const set=createGradient();for(const id of Object.keys(gradientModes))for(let i=0;i<4;i++){const s=set.states[id];set.states[id]=gradientStep(s,gradientSlope(s.w)<0?'right':'left');}assert.equal(gradientComplete(set),true);assert.deepEqual(restoreGradient({selected:'small',steps:{small:4,large:4}}),set);assert.throws(()=>restoreGradient({selected:'small',steps:{small:5,large:0}}),RangeError);
});
