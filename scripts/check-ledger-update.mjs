import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {ledgerUpdate} from '../src/ledger-update.js';

const processResult=spawnSync(process.platform==='win32'?'python':'python3',['scripts/check-ledger-update.py'],{encoding:'utf8'});
if(processResult.status!==0)throw new Error(processResult.stderr||'SQLite comparison failed');
const reference=JSON.parse(processResult.stdout);
for(const item of reference.results){
 const actual=ledgerUpdate([3,1,0,null],item.filter,item.operation);
 assert.equal(actual.ok,item.ok,`${item.filter}/${item.operation}`);
 assert.deepEqual(actual.values,item.values,`${item.filter}/${item.operation}`);
 if(item.ok)assert.equal(actual.matched,item.matched,`${item.filter}/${item.operation}`);
}
console.log(`SQLite ${reference.sqlite_version}: ${reference.results.length} update combinations matched.`);
