import test from 'node:test';
import assert from 'node:assert/strict';
import {orientationCases,orientationValid,orientationReachable,createOrientationTrial,orientationStep,createOrientation,orientationComplete,restoreOrientation} from '../src/robot-orientation.js';

test('all positions and orientations match independent cell collision calculation',()=>{
 for(const [id,c] of Object.entries(orientationCases))for(let y=-1;y<=5;y++)for(let x=-1;x<=5;x++)for(const dir of ['h','v']){const cells=dir==='h'?[[x,y],[x+1,y]]:[[x,y],[x,y+1]];const expected=cells.every(([a,b])=>a>=0&&a<5&&b>=0&&b<5&&(b!==2||a===2||(c.wide&&a===3)));assert.equal(orientationValid(id,x,y,dir),expected);}
});
test('reachability matches independent fixed-point search on positions and orientations',()=>{
 for(const [id,c] of Object.entries(orientationCases)){const reached=new Set(['2,0,h']);let changed=true;while(changed){changed=false;for(const key of [...reached]){const [sx,sy,dir]=key.split(','),x=Number(sx),y=Number(sy),next=[[x+1,y,dir],[x-1,y,dir],[x,y+1,dir],[x,y-1,dir]];if(c.rotate)next.push([x,y,dir==='h'?'v':'h']);for(const [nx,ny,nd] of next){const k=`${nx},${ny},${nd}`;if(!reached.has(k)&&orientationValid(id,nx,ny,nd)){reached.add(k);changed=true;}}}}assert.equal(orientationReachable(id),[...reached].some(k=>k.startsWith('2,3,')));}
 assert.equal(orientationReachable('locked'),false);assert.equal(orientationReachable('turn'),true);assert.equal(orientationReachable('wide'),true);
});
test('rotation collision, no-path reporting, goal and replay',()=>{
 const histories={locked:['down','down','noPath'],turn:['turn','down','down','turn','down'],wide:['down','down','down']};let t=createOrientationTrial('turn');for(const a of ['turn','down','down'])t=orientationStep(t,a);const blocked=orientationStep(t,'turn');assert.equal(blocked.dir,'v');assert.equal(blocked.x,t.x);assert.equal(blocked.blocked,1);assert.equal(orientationStep(blocked,'down').solved,true);
 for(const [id,actions] of Object.entries(histories)){let trial=createOrientationTrial(id);for(const action of actions)trial=orientationStep(trial,action);assert.equal(trial.solved,true);assert.throws(()=>orientationStep(trial,'down'));}const r=restoreOrientation({selected:'turn',histories,answer:'pose',checked:true});assert.equal(orientationComplete(r),true);assert.equal(orientationComplete(createOrientation()),false);assert.throws(()=>restoreOrientation({selected:'turn',histories:{...histories,turn:['bad']},answer:null,checked:false}));
});
