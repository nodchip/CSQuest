import test from 'node:test';
import assert from 'node:assert/strict';
import {robotPlatformScenes,robotPlatformDrives,robotPlatformSensors,createRobotPlatform,robotPlatformAct,restoreRobotPlatform,robotPlatformComplete} from '../src/robot-platform.js';
const act=(s,a)=>{const r=robotPlatformAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
test('all 12 scenario and platform combinations honor sensing, geometry and energy',()=>{
 for(const scene of Object.keys(robotPlatformScenes))for(const drive of Object.keys(robotPlatformDrives))for(const sensor of Object.keys(robotPlatformSensors)){
  let s=createRobotPlatform();for(const a of [`scene:${scene}`,`drive:${drive}`,`sensor:${sensor}`])s=act(s,a);
  for(let i=0;i<4;i++){
   s=act(s,'scan');const before=s.run.position,r=robotPlatformAct(s,'forward');if(!r.ok)break;s=r.state;if(s.run.position===before)break;
  }
  const expected=!(scene==='night'&&sensor==='camera')&&!(scene==='gap'&&drive==='wheel')&&!(scene==='tunnel'&&drive==='fly');
  assert.equal(s.run.status==='arrived',expected,`${scene}/${drive}/${sensor}`);if(expected)assert.equal(s.run.energy,8-4*robotPlatformDrives[drive].cost);
 }
});
test('three limitations, three deliveries and reflection are required and restored',()=>{
 let s=createRobotPlatform();s=act(s,'scan');assert.ok(s.seen.includes('dark'));assert.equal(robotPlatformAct(s,'forward').ok,false);
 for(const a of ['scene:gap','drive:wheel','sensor:range','scan','forward','scan','forward'])s=act(s,a);assert.ok(s.seen.includes('gap'));
 for(const a of ['scene:tunnel','drive:fly','scan','forward','scan','forward'])s=act(s,a);assert.ok(s.seen.includes('low'));
 for(const [scene,drive] of [['night','wheel'],['gap','fly'],['tunnel','wheel']]){
  for(const a of [`scene:${scene}`,`drive:${drive}`,'sensor:range'])s=act(s,a);
  for(let i=0;i<4;i++)for(const a of ['scan','forward'])s=act(s,a);
 }
 for(const a of ['answer:universal','check'])s=act(s,a);assert.equal(robotPlatformComplete(s),false);
 for(const a of ['answer:fit','check'])s=act(s,a);assert.equal(robotPlatformComplete(s),true);
 assert.deepEqual(restoreRobotPlatform(JSON.parse(JSON.stringify(s))),s);assert.throws(()=>restoreRobotPlatform({history:['forward']}),RangeError);
});
