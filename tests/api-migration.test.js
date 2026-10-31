import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createMigration,stepMigration,migrationResult,migrationComplete,restoreMigration} from '../src/api-migration.js';
test('removing old too early interrupts old users, while staged migration preserves their quantity',()=>{
 let s=createMigration();s=stepMigration(s,'removeOld');assert.equal(migrationResult(s,'traveler').ok,false);s=stepMigration(s,'restoreOld');for(const action of ['addNew','screen','desk','survey','traveler'])s=stepMigration(s,action);for(const id of ['screen','desk','traveler'])assert.deepEqual(migrationResult(s,id),{ok:true,quantity:2});s=stepMigration(s,'removeOld');s=stepMigration(s,'test');assert.equal(migrationComplete(s),true);s=stepMigration(s,'restoreOld');assert.equal(migrationComplete(s),false);assert.equal(s.tested,false);
});
test('discovery is required, unavailable new window is visible, and histories are replayed',()=>{
 let s=createMigration();s=stepMigration(s,'traveler');assert.equal(s.clients.traveler,'old');s=stepMigration(s,'screen');assert.equal(migrationResult(s,'screen').ok,false);const copy=restoreMigration({...s,new:true});assert.equal(copy.new,false);assert.throws(()=>restoreMigration({history:['invalid']}),RangeError);
});
