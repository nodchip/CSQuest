import test from 'node:test';
import assert from 'node:assert/strict';
import {kinematicsAngles} from '../src/forward-kinematics.js';
import {inversePosition,createInverse,addInversePose,inverseComplete,restoreInverse} from '../src/inverse-kinematics.js';
test('enumerating the angle grid finds two different poses and no point beyond length two',()=>{const solutions=[];for(const base of kinematicsAngles)for(const joint of kinematicsAngles){const {tip}=inversePosition(base,joint);assert.ok(Math.hypot(tip.x,tip.y)<=2);if(tip.x===1&&tip.y===1)solutions.push([base,joint]);}assert.deepEqual(solutions,[[0,90],[90,270]]);});
test('two distinct valid poses and the distance reason are needed; draft validation rejects duplicates',()=>{let s=createInverse();assert.equal(addInversePose(s).solutions.length,0);s.base=0;s.joint=90;s=addInversePose(s);assert.equal(addInversePose(s).solutions.length,1);s.base=90;s.joint=270;s=addInversePose(s);s.reason='length';s.checked=true;assert.equal(inverseComplete(s),true);assert.equal(inverseComplete(restoreInverse(s)),true);assert.throws(()=>restoreInverse({...s,solutions:[s.solutions[0],s.solutions[0]]}));});
