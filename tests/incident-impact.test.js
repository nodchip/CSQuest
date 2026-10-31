import test from 'node:test';
import assert from 'node:assert/strict';
import {incidentSites,createIncidentImpact,incidentAffectedCount,incidentImpactComplete,restoreIncidentImpact} from '../src/incident-impact.js';
test('affected requests are counted only for marked sites, not the whole population',()=>{const s=createIncidentImpact();s.inspected=Object.keys(incidentSites);s.selected=['north','east'];assert.equal(incidentAffectedCount(s),20);s.answer='unknown';s.response='inform';s.checked=true;assert.equal(incidentImpactComplete(s),true);assert.deepEqual(restoreIncidentImpact(s),s);s.selected.push('south');assert.equal(incidentAffectedCount(s),26);assert.equal(incidentImpactComplete(s),false);});
test('uninspected and duplicate sites are rejected in saved drafts',()=>{const s=createIncidentImpact();assert.throws(()=>restoreIncidentImpact({...s,selected:['north']}));assert.throws(()=>restoreIncidentImpact({...s,inspected:['north','north']}));});
