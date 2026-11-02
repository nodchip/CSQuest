import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {localeLanguages,localeZones,localeTimeFormat,localeRequired,localeTimeCreate,localeTimeInspect,localeTimeComplete,localeTimeRestore} from '../src/locale-time-workshop.js';

test('all locale and zone combinations preserve the instant and yield expected local calendar parts',()=>{
 const expected={utc:{year:'2024',month:'04',day:'03',hour:'23',minute:'30'},tokyo:{year:'2024',month:'04',day:'04',hour:'08',minute:'30'},la:{year:'2024',month:'04',day:'03',hour:'16',minute:'30'}};
 for(const language of Object.keys(localeLanguages))for(const zone of Object.keys(localeZones)){const result=localeTimeFormat(language,zone);assert.deepEqual(result.values,expected[zone]);assert.ok(result.text.length>0);}
 assert.throws(()=>localeTimeFormat('bad','utc'));assert.throws(()=>localeTimeFormat('ja','bad'));
});
test('four comparisons and both reflections are needed; saved selections are checked',()=>{
 const q=localeTimeCreate();for(const key of localeRequired){[q.language,q.zone]=key.split(':');localeTimeInspect(q);}q.dateAnswer='ambiguous';q.independence='language';assert.equal(localeTimeComplete(q),false);q.independence='independent';assert.equal(localeTimeComplete(q),true);
 const copy=localeTimeRestore(q);copy.seen.pop();assert.equal(q.seen.length,4);assert.throws(()=>localeTimeRestore({...q,last:'bad'}));assert.throws(()=>localeTimeRestore({...q,seen:['ja:la','ja:la']}));
});
