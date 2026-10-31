import {test} from 'node:test';
import assert from 'node:assert/strict';
import {birthdayProbability,createBirthday,birthdayComplete,restoreBirthday} from '../src/birthday-collision.js';
test('exact probabilities agree with independent enumeration for up to five draws',()=>{
 for(let n=0;n<=5;n++){let total=0,collisions=0,targets=0;function visit(a){if(a.length===n){total++;if(new Set(a).size<n)collisions++;if(a.includes(0))targets++;return;}for(let i=0;i<8;i++)visit([...a,i]);}visit([]);const r=birthdayProbability(n);assert.ok(Math.abs(r.collision-collisions/total)<1e-12);assert.ok(Math.abs(r.target-targets/total)<1e-12);}
 assert.equal(birthdayProbability(9).collision,1);assert.ok(birthdayProbability(4).collision>birthdayProbability(4).target);assert.throws(()=>birthdayProbability(10),RangeError);
});
test('three observations and an explicitly checked comparison are required',()=>{const s=createBirthday();s.draws=9;s.seen=[1,4,9];s.answer='collision';s.checked=true;const copy=restoreBirthday(s);s.seen.pop();assert.equal(birthdayComplete(s),false);assert.equal(birthdayComplete(copy),true);assert.throws(()=>restoreBirthday({...copy,seen:[1,4]}),RangeError);});
