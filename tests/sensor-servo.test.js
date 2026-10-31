import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sensorServoCases,createSensorServoTrial,sensorServoStep,createSensorServo,sensorServoComplete,restoreSensorServo} from '../src/sensor-servo.js';

test('reading, command and physical movement are separate; wrong targets can be corrected',()=>{
 let s=createSensorServoTrial('bright');assert.equal(sensorServoStep(s,180).history.length,0);s=sensorServoStep(s,'sample');s=sensorServoStep(s,0);s=sensorServoStep(s,'tick');assert.equal(s.angle,0);assert.equal(sensorServoStep(s,'check').done,false);
 s=sensorServoStep(s,180);assert.equal(s.angle,0);s=sensorServoStep(s,'tick');assert.equal(s.angle,90);assert.equal(sensorServoStep(s,'check').done,false);s=sensorServoStep(s,'tick');assert.equal(s.angle,180);assert.equal(sensorServoStep(s,'check').done,true);
});
test('all readings reach the required angle and histories reject impossible actions',()=>{
 const s=createSensorServo();for(const [id,c] of Object.entries(sensorServoCases)){let t=s.trials[id];t=sensorServoStep(t,'sample');t=sensorServoStep(t,c.target);if(t.angle!==t.target)t=sensorServoStep(t,'tick');t=sensorServoStep(t,'check');s.trials[id]=t;}assert.equal(sensorServoComplete(s),true);
 const saved={selected:'bright',histories:Object.fromEntries(Object.entries(s.trials).map(([id,t])=>[id,t.history]))};assert.equal(sensorServoComplete(restoreSensorServo(saved)),true);saved.histories.bright=['tick'];assert.throws(()=>restoreSensorServo(saved),RangeError);
});
