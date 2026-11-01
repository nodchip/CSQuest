import test from 'node:test';
import assert from 'node:assert/strict';
import {robotConfigCases,robotValid,robotCanReach,createRobotConfigTrial,robotConfigStep,createRobotConfig,robotConfigComplete,restoreRobotConfig} from '../src/robot-configuration.js';

test('every anchor matches an independent footprint-and-wall intersection check',()=>{
 for(const [id,c] of Object.entries(robotConfigCases))for(let y=-1;y<=5;y++)for(let x=-1;x<=5;x++){const cells=[];for(let i=0;i<c.size*c.size;i++)cells.push([x+i%c.size,y+Math.floor(i/c.size)]);const valid=cells.every(([a,b])=>a>=0&&a<5&&b>=0&&b<5&&(b!==2||a===2||(c.wide&&a===3)));assert.equal(robotValid(id,x,y),valid);}
});
test('paths and no-path are consistent with independent reachability sets',()=>{
 for(const [id,c] of Object.entries(robotConfigCases)){const reached=new Set(['2,0']);let changed=true;while(changed){changed=false;for(const key of [...reached]){const [x,y]=key.split(',').map(Number);for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0]]){const nx=x+dx,ny=y+dy,k=`${nx},${ny}`;if(!reached.has(k)&&robotValid(id,nx,ny)){reached.add(k);changed=true;}}}}assert.equal(robotCanReach(id),reached.has(c.goal.join(',')));}
 assert.equal(robotCanReach('small'),true);assert.equal(robotCanReach('narrow'),false);assert.equal(robotCanReach('wide'),true);
});
test('movement, blocked report, three trials and replay',()=>{
 const histories={small:['down','down','down','down'],narrow:['down','noPath'],wide:['down','down','down']};for(const [id,actions] of Object.entries(histories)){let t=createRobotConfigTrial(id);if(id==='narrow'){const early=robotConfigStep(t,'noPath');assert.equal(early.solved,false);}for(const a of actions)t=robotConfigStep(t,a);assert.equal(t.solved,true);assert.throws(()=>robotConfigStep(t,'down'));}
 const r=restoreRobotConfig({selected:'wide',histories,answer:'footprint',checked:true});assert.equal(robotConfigComplete(r),true);assert.equal(robotConfigComplete(createRobotConfig()),false);assert.throws(()=>restoreRobotConfig({selected:'small',histories:{...histories,small:['unknown']},answer:null,checked:false}));
});
