import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {exampleDays,exampleVillages,exampleMinimums,exampleOutputs,exampleQuery} from '../src/example-query.js';

const conditions=[];
for(const day of Object.keys(exampleDays))for(const village of Object.keys(exampleVillages))for(const minimum of Object.keys(exampleMinimums))for(const output of Object.keys(exampleOutputs))conditions.push({day,village,minimum,output});
const input=JSON.stringify({days:exampleDays,conditions});
const run=spawnSync(process.platform==='win32'?'python':'python3',['scripts/check-example-query.py'],{input,encoding:'utf8'});
if(run.status!==0)throw new Error(run.stderr||'SQLite comparison failed');
const reference=JSON.parse(run.stdout);
assert.equal(reference.results.length,conditions.length);
for(const {day,village,minimum,output,values} of reference.results)assert.deepEqual([...exampleQuery(village,minimum,output,day)].sort(),values.sort(),[day,village,minimum,output].join('/'));
console.log(`SQLite ${reference.sqlite_version}: ${conditions.length} query combinations matched (unordered distinct results).`);
