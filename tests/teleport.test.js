import test from 'node:test';
import assert from 'node:assert/strict';
import {teleportInputs,teleportCases,teleportBranch,teleportCorrect,teleportSame,createTeleport,teleportAct,restoreTeleport,teleportComplete} from '../src/teleport.js';

function act(s,a){const r=teleportAct(s,a);assert.equal(r.ok,true,r.message);return r.state;}
test('all measurement branches have probability one quarter and the communicated corrections recover each input',()=>{
 for(const [name,input] of Object.entries(teleportInputs))for(const bits of ['00','01','10','11']){
  const b=teleportBranch(name,bits);assert.ok(Math.abs(b.probability-.25)<1e-12);
  const out=teleportCorrect(b.before,bits[1]==='1',bits[0]==='1');assert.ok(teleportSame(out,input.vector),`${name} ${bits}`);
 }
 assert.throws(()=>teleportBranch('zero','02'),RangeError);
});
test('the state cannot be corrected before the message and all branches and reflection are needed',()=>{
 let s=createTeleport();assert.equal(teleportAct(s,'send').ok,false);s=act(s,'measure');assert.equal(teleportAct(s,'x').ok,false);s=act(s,'send');s=act(s,'verify');
 for(const [key,c] of Object.entries(teleportCases)){
  s=act(s,`case:${key}`);s=act(s,'measure');s=act(s,'send');if(c.bits[1]==='1')s=act(s,'x');if(c.bits[0]==='1')s=act(s,'z');s=act(s,'verify');assert.equal(s.report.same,true);assert.equal(s.report.rule,true);
 }
 assert.equal(teleportComplete(s),false);s=act(s,'answer:copy');s=act(s,'check');assert.equal(teleportComplete(s),false);s=act(s,'answer:classical');s=act(s,'check');assert.equal(teleportComplete(s),true);
 assert.deepEqual(restoreTeleport(JSON.parse(JSON.stringify(s))),s);assert.throws(()=>restoreTeleport({history:['send']}),RangeError);
});
test('an accidental match for one input does not establish the general correction rule',()=>{
 let s=createTeleport();for(const a of ['case:c11','measure','send','z','verify'])s=act(s,a);
 assert.equal(s.report.same,true);assert.equal(s.report.rule,false);assert.equal(s.solved.includes('c11'),false);
});
