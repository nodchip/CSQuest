import test from 'node:test';
import assert from 'node:assert/strict';
import {createDesignJourney,designJourneyAct,designJourneyClients,restoreDesignJourney} from '../src/design-journey.js';
const act=(s,a)=>{const r=designJourneyAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
test('the adventure requires both contract comparisons and a complete migration',()=>{
 let s=createDesignJourney();s=act(s,'move:workshop');
 for(const a of ['test:old','test:new'])s=act(s,a);
 assert.equal(s.oldReport.every(r=>r.pass),true);assert.equal(s.newReport.every(r=>r.pass),false);assert.equal(designJourneyAct(s,'move:desk').ok,false);
 for(const a of ['design:shared','test:old','test:new','move:desk','mig:removeOld','mig:test'])s=act(s,a);
 assert.ok(designJourneyClients(s).every(c=>!c.ok));assert.equal(designJourneyAct(s,'move:festival').ok,false);
 for(const a of ['mig:restoreOld','mig:addNew','mig:screen','mig:desk','mig:removeOld','mig:test'])s=act(s,a);
 assert.ok(designJourneyClients(s).every(c=>c.ok));assert.equal(designJourneyAct(s,'move:festival').ok,false);
 for(const a of ['mig:restoreOld','mig:survey','mig:traveler','mig:removeOld','mig:test','move:festival'])s=act(s,a);
 assert.equal(s.status,'won');assert.deepEqual(restoreDesignJourney(JSON.parse(JSON.stringify(s))),s);
});
test('failed refactor cannot pass the first contract and edits invalidate both results',()=>{
 let s=createDesignJourney();for(const a of ['move:workshop','design:fee','test:old'])s=act(s,a);
 assert.ok(s.oldReport.some(r=>!r.pass));s=act(s,'design:shared');assert.equal(s.oldReport,null);
 for(const a of ['test:old','test:new','design:late'])s=act(s,a);assert.equal(s.oldReport,null);assert.equal(s.newReport,null);
 assert.throws(()=>restoreDesignJourney({history:['move:festival']}),RangeError);
});
