import {test} from 'node:test';
import assert from 'node:assert/strict';
import {rigidPlaces,rigidDirections,rigidResult,rigidCreate,rigidCheck,rigidComplete,rigidRestore} from '../src/rigid-impulse.js';

test('linear and angular impulses yield independent expected translations and rotations',()=>{
 const expected={left:{up:[1,-1,'cw'],down:[-1,1,'ccw']},center:{up:[1,0,'none'],down:[-1,0,'none']},right:{up:[1,1,'ccw'],down:[-1,-1,'cw']}};
 for(const p of Object.keys(rigidPlaces))for(const d of Object.keys(rigidDirections)){const r=rigidResult(p,d),[vy,omega,turn]=expected[p][d];assert.deepEqual([r.vy,r.omega,r.turn],[vy,omega,turn]);assert.equal(r.impulse,2*vy);assert.equal(r.angularImpulse,2*omega);assert.equal(r.centerY,vy/2);assert.equal(r.angle,omega/2);const [x,y]=[Math.cos(r.angle),Math.sin(r.angle)];assert.ok(Math.abs(Math.hypot(2*x,2*y)-2)<1e-12);}
 assert.throws(()=>rigidResult('other','up'));
});
test('all six trials and the translation/rotation reflection are required and saved checks are validated',()=>{
 let q=rigidCreate();for(const p of Object.keys(rigidPlaces))for(const d of Object.keys(rigidDirections)){q.place=p;q.direction=d;const t=q.trials[`${p}:${d}`],correct=rigidResult(p,d).turn;t.guess=['cw','ccw','none'].find(x=>x!==correct);assert.equal(rigidCheck(q),false);t.guess=correct;assert.equal(rigidCheck(q),true);q=rigidRestore(q);}assert.equal(rigidComplete(q),false);q.answer='both';assert.equal(rigidComplete(q),true);const copy=rigidRestore(q);copy.trials['left:up'].guess='none';assert.equal(rigidComplete(q),true);assert.equal(rigidComplete(copy),false);assert.throws(()=>rigidRestore(copy));
});
