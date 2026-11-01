import test from 'node:test';
import assert from 'node:assert/strict';
import {healthProxyStudyModels,createHealthProxyStudy,healthProxyStudyComplete,restoreHealthProxyStudy} from '../src/health-proxy-study.js';

test('reported table 2 proportions and corresponding maxima are accurate',()=>{
 assert.deepEqual(Object.values(healthProxyStudyModels).map(x=>[x.cost,x.avoidable,x.health,x.black]),[[.165,.187,.105,.141],[.142,.215,.130,.210],[.121,.182,.148,.267]]);
 assert.equal(Object.entries(healthProxyStudyModels).reduce((a,b)=>a[1].cost>b[1].cost?a:b)[0],'cost');assert.equal(Object.entries(healthProxyStudyModels).reduce((a,b)=>a[1].health>b[1].health?a:b)[0],'health');
});
test('all studies and three answers are required and restore copies observations',()=>{
 const s=createHealthProxyStudy();s.observed=['cost','avoidable','health'];s.costAnswer='cost';s.healthAnswer='health';s.meaningAnswer='proxy';s.checked=true;const copy=restoreHealthProxyStudy(s);assert.equal(healthProxyStudyComplete(copy),true);copy.observed.pop();assert.equal(s.observed.length,3);assert.equal(healthProxyStudyComplete(copy),false);assert.equal(healthProxyStudyComplete({...s,meaningAnswer:'neutral'}),false);assert.throws(()=>restoreHealthProxyStudy({...s,observed:['cost','cost']}));
});
