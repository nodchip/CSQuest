import test from 'node:test';
import assert from 'node:assert/strict';
import {createRobot,robotAction,restoreRobot} from '../src/robot.js';
function play(map,actions){return actions.reduce(robotAction,createRobot(map));}
const upper=['left','scan','forward','right','scan','forward','scan','forward','scan','forward','right','scan','forward'];
const lower=['scan','forward','scan','right','scan','forward','left','scan','forward','scan','forward','left','scan','forward'];
test('both routes reach the goal within the movement budget using sensor observations',()=>{
  assert.equal(play('upper',upper).status,'found');assert.equal(play('upper',upper).moves,5);
  assert.equal(play('lower',lower).status,'found');assert.equal(play('lower',lower).moves,5);
});
test('movement without sensing does not advance, and an observed wall leads to a failed attempt',()=>{
  let s=createRobot('upper');assert.equal(robotAction(s,'forward').actions,0);s=robotAction(s,'scan');assert.equal(s.sensed,'blocked');s=robotAction(s,'forward');assert.equal(s.status,'failed');assert.equal(s.x,0);
});
test('turning invalidates a reading and partial attempts restore independently',()=>{
  let s=createRobot('upper');s=robotAction(s,'scan');s=robotAction(s,'left');assert.equal(s.sensed,null);
  const resumed=restoreRobot({selected:'lower',steps:{upper:upper.slice(0,3),lower:lower.slice(0,3)}});assert.equal(resumed.states.upper.y,0);assert.equal(resumed.states.lower.sensed,'blocked');
  assert.throws(()=>restoreRobot({selected:'upper',steps:{upper:['forward'],lower:[]}}),RangeError);
});
