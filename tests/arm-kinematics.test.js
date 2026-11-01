import test from 'node:test';
import assert from 'node:assert/strict';
import {baseAngles,elbowAngles,armPose,createArm,armCheck,armComplete,restoreArm} from '../src/arm-kinematics.js';
test('all angle pairs match independent trigonometric kinematics and find two target poses',()=>{
 const matches=[];for(const b of baseAngles)for(const e of elbowAngles){const r=armPose(b,e),theta=b*Math.PI/180,phi=(b+e)*Math.PI/180;assert.ok(Math.abs(r.tip[0]-(Math.cos(theta)+Math.cos(phi)))<1e-9);assert.ok(Math.abs(r.tip[1]-(Math.sin(theta)+Math.sin(phi)))<1e-9);if(r.tip[0]===1&&r.tip[1]===1)matches.push(`${b},${e}`);assert.ok(!(r.tip[0]===2&&r.tip[1]===2));}assert.deepEqual(matches,['0,90','90,-90']);
});
test('two different checked configurations and the unreachable reflection are required',()=>{
 let s=createArm();s.elbow=90;s=armCheck(s);s=armCheck(s);assert.equal(s.found.length,1);s.base=90;s.elbow=-90;s=armCheck(s);assert.equal(armComplete(s),false);s.unreachable=true;assert.equal(armComplete(s),true);const copy=restoreArm(s);copy.found.pop();assert.equal(armComplete(copy),false);assert.equal(armComplete(s),true);assert.throws(()=>restoreArm({...s,found:['0,90','0,90']}));assert.throws(()=>restoreArm({...s,found:['0,0']}));
});
