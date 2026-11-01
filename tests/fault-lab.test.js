import test from 'node:test';
import assert from 'node:assert/strict';
import {faultResult,createFaultLab,faultLabAct,faultLabComplete,restoreFaultLab} from '../src/fault-lab.js';
import {restoreTesting,testingComplete} from '../src/testing.js';

const act=(s,a)=>{const r=faultLabAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
test('faults may remain dormant or be handled before a service violation',()=>{
 const dormant=faultResult('software',2,'raw');assert.equal(dormant.internal,true);assert.equal(dormant.failure,false);
 for(const [kind,input] of [['software',1],['hardware',3]]){const raw=faultResult(kind,input,'raw'),guard=faultResult(kind,input,'guard');assert.equal(raw.expected,true);assert.equal(raw.internal,false);assert.equal(raw.failure,true);assert.equal(guard.detected,true);assert.equal(guard.handled,true);assert.equal(guard.actual,true);assert.equal(guard.failure,false);}
 const raw=faultResult('exception',0,'raw'),guard=faultResult('exception',0,'guard');assert.equal(raw.internal,'例外発生');assert.equal(raw.actual,null);assert.equal(raw.failure,true);assert.equal(guard.actual,0);assert.equal(guard.failure,false);assert.throws(()=>faultResult('unknown',0,'raw'));
});
test('all observations and a nuanced explanation are needed; histories restore',()=>{
 let s=createFaultLab();for(const [kind,input,mode] of [['software',2,'raw'],['software',1,'raw'],['software',1,'guard'],['hardware',3,'raw'],['hardware',3,'guard'],['exception',0,'raw'],['exception',0,'guard']])for(const action of [`case:${kind}`,`input:${input}`,`mode:${mode}`,'run'])s=act(s,action);
 s=act(s,'answer:always');s=act(s,'check');assert.equal(faultLabComplete(s),false);s=act(s,'answer:separate');s=act(s,'check');assert.equal(faultLabComplete(s),true);assert.deepEqual(restoreFaultLab(s),s);
 assert.equal(testingComplete(restoreTesting({selected:[1,6],ran:true,lab:{history:s.history}})),true);assert.throws(()=>restoreFaultLab({history:['case:other']}));
});
