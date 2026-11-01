import test from 'node:test';
import assert from 'node:assert/strict';
import {cloneTrial,createQuantumJourney,quantumJourneyAct,restoreQuantumJourney} from '../src/quantum-journey.js';
const act=(s,a)=>{const r=quantumJourneyAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
test('controlled NOT copies basis states but not these superpositions',()=>{
 for(const [input,expected] of [['zero',1],['one',1],['plus',.5],['minus',0]])assert.ok(Math.abs(cloneTrial(input).fidelity-expected)<1e-12);
 assert.throws(()=>cloneTrial('unknown'),RangeError);
});
test('the journey checks each gate, cloning experiment, classical message and correction',()=>{
 let s=createQuantumJourney();s=act(s,'move:gate');assert.equal(quantumJourneyAct(s,'move:lab').ok,false);
 for(const a of ['add:ab','add:ha','build'])s=act(s,a);assert.equal(s.ready,false);
 for(const a of ['clear','add:ha','add:ab','build','move:lab'])s=act(s,a);assert.equal(s.ready,true);
 assert.equal(quantumJourneyAct(s,'move:tower').ok,false);
 for(const input of ['zero','one','plus','minus']){s=act(s,`input:${input}`);s=act(s,'trial');}
 for(const a of ['answer:yes','seal'])s=act(s,a);assert.equal(s.sealed,false);
 for(const a of ['answer:no','seal','move:tower','measure'])s=act(s,a);assert.equal(quantumJourneyAct(s,'z').ok,false);
 for(const a of ['send','transfer'])s=act(s,a);assert.equal(s.lit,false);
 for(const a of ['z','transfer','move:beacon'])s=act(s,a);assert.equal(s.status,'won');
 assert.deepEqual(restoreQuantumJourney(JSON.parse(JSON.stringify(s))),s);
 assert.throws(()=>restoreQuantumJourney({history:['move:beacon']}),RangeError);
});
test('changing the prepared gates invalidates downstream access',()=>{
 let s=createQuantumJourney();for(const a of ['move:gate','add:ha','add:ab','build','move:lab'])s=act(s,a);
 for(const input of ['zero','one','plus','minus']){s=act(s,`input:${input}`);s=act(s,'trial');}
 for(const a of ['answer:no','seal','move:gate','clear','add:ab','build'])s=act(s,a);
 assert.equal(s.ready,false);assert.equal(s.sealed,false);assert.equal(quantumJourneyAct(s,'move:lab').ok,false);
});
