import test from 'node:test';
import assert from 'node:assert/strict';
import {createCiForge,ciForgeAct,restoreCiForge,ciForgeComplete} from '../src/ci-forge.js';
const act=(s,a)=>{const r=ciForgeAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
const run=(s)=>['start','step:checkout','step:install','step:build','step:test'].reduce(act,s);
test('検査記録は開始時の版に属し、新しい共有版には使えない',()=>{let s=createCiForge();s=act(s,'start');s=act(s,'head:B');for(const a of ['step:checkout','step:install','step:build','step:test','deploy'])s=act(s,a);assert.equal(s.report.revision,'A');assert.equal(s.deployed,null);assert.ok(s.observed.includes('stale-report'));s=run(s);assert.equal(s.report.status,'test-failed');assert.equal(ciForgeAct(s,'step:build').ok,false);});
test('材料表に合わないキャッシュは組立を止め、修正後に C を届ける',()=>{let s=run(createCiForge());s=act(s,'head:B');s=act(s,'deploy');s=run(s);s=act(s,'head:C');s=act(s,'cache:stale');for(const a of ['start','step:checkout','step:install','step:build'])s=act(s,a);assert.equal(s.report.status,'build-failed');assert.equal(ciForgeAct(s,'step:test').ok,false);s=act(s,'deploy');assert.equal(s.deployed,null);s=act(s,'cache:locked');s=run(s);s=act(s,'deploy');s=act(s,'answer:scope');s=act(s,'check');assert.equal(ciForgeComplete(s),true);assert.deepEqual(restoreCiForge(JSON.parse(JSON.stringify(s))),s);});
test('途中記録は操作を再生して検証する',()=>{assert.throws(()=>restoreCiForge({history:['step:test']}));assert.throws(()=>restoreCiForge({history:[null]}));assert.throws(()=>restoreCiForge({history:Array(129).fill('start')}));});
