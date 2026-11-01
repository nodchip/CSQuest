import test from 'node:test';
import assert from 'node:assert/strict';
import {weatherJourneyCosts,createWeatherJourney,weatherJourneyAct,restoreWeatherJourney} from '../src/weather-journey.js';
const act=(s,a)=>{const r=weatherJourneyAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
test('posterior and expected costs distinguish the two loads',()=>{
 const a=weatherJourneyCosts('ordinary'),b=weatherJourneyCosts('fragile');
 assert.ok(Math.abs(a.sunny-392/529)<1e-12);
 assert.ok(Math.abs(a.mountain-1625/529)<1e-12);assert.ok(Math.abs(b.mountain-2584/529)<1e-12);
 assert.ok(a.mountain<a.shelter);assert.ok(b.mountain>b.shelter);assert.throws(()=>weatherJourneyCosts('unknown'),RangeError);
});
test('observations and both expected-cost decisions are needed for the journey',()=>{
 let s=createWeatherJourney();s=act(s,'move:lookout');assert.equal(weatherJourneyAct(s,'move:depot').ok,false);
 for(const a of ['likelihood:L','observe'])s=act(s,a);assert.equal(s.steps,0);assert.equal(s.feedback,true);
 for(const a of ['likelihood:D','observe','likelihood:L','observe','move:depot'])s=act(s,a);assert.equal(s.steps,2);
 s=act(s,'plan:ordinary:shelter');assert.equal(s.plans.ordinary,null);assert.equal(weatherJourneyAct(s,'move:village').ok,false);
 for(const a of ['plan:ordinary:mountain','plan:fragile:mountain'])s=act(s,a);assert.equal(s.plans.fragile,null);
 for(const a of ['plan:fragile:shelter','move:village'])s=act(s,a);assert.equal(s.status,'won');
 assert.deepEqual(restoreWeatherJourney(JSON.parse(JSON.stringify(s))),s);assert.throws(()=>restoreWeatherJourney({history:['move:village']}),RangeError);
});
