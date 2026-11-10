import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {expectedRows,queryJoinCases,replayQueryJoin} from '../src/endgame-query-join.js';

test('inner join includes all matching pairs, and excludes unmatched rows',()=>{
 assert.deepEqual(expectedRows('join',queryJoinCases.join[0]),['0-0','0-1']);
 assert.deepEqual(expectedRows('join',queryJoinCases.join[1]),['0-0','0-1','1-2']);
 assert.equal(replayQueryJoin('join',['row:0-0','check']),null);
 const partial=['row:0-0'];assert.deepEqual(replayQueryJoin('join',JSON.parse(JSON.stringify(partial))).selected,['0-0']);
 assert.deepEqual(replayQueryJoin('join',[...partial,'reset']).selected,[]);
 const h=['row:0-0','row:0-1','check','row:0-0','row:0-1','row:1-2','check'];assert.equal(replayQueryJoin('join',h).done,true);assert.equal(replayQueryJoin('join',[...h,'check']),null);
});
test('selection, projection and empty result require the stated conditions',()=>{
 assert.deepEqual(expectedRows('select',queryJoinCases.select[0]),['0','2']);assert.deepEqual(expectedRows('select',queryJoinCases.select[1]),['1']);
 assert.equal(replayQueryJoin('select',['row:0','check']),null);
 assert.equal(replayQueryJoin('select',['row:0','row:2','check','row:1','check']).done,true);
 const h=['row:0-0','row:0-1','check','column:name','column:item','check','row:1-2','check','column:item','column:name','check','check','column:name','column:item','check'];
 const result=replayQueryJoin('compose',h);assert.equal(result.done,true);assert.deepEqual(result.results,[['0-0','0-1'],['1-2'],[]]);
 assert.equal(replayQueryJoin('compose',['row:0-0','row:0-1','check','column:key','column:name','check']),null);
});
test('independent SQLite query retains duplicate projected rows and returns no match',()=>{
 const code=`import sqlite3,json\nc=sqlite3.connect(':memory:')\nc.executescript("create table people(name text, village integer); create table parcels(item text, village integer); insert into people values ('A',1),('B',2); insert into parcels values ('薬草',1),('薬草',1),('道具',3);")\nq="select people.name,parcels.item from people join parcels on people.village=parcels.village where people.village=? order by people.name,parcels.item"\nprint(json.dumps([c.execute(q,(1,)).fetchall(),c.execute(q,(2,)).fetchall()],ensure_ascii=False))`;
 const run=spawnSync(process.platform==='win32'?'python':'python3',['-c',code],{encoding:'utf8',env:{...process.env,PYTHONIOENCODING:'utf-8'}});assert.equal(run.status,0,run.stderr);assert.deepEqual(JSON.parse(run.stdout),[[['A','薬草'],['A','薬草']],[]]);
 const c=queryJoinCases.compose[0];assert.deepEqual(expectedRows('compose',c).map(id=>{const [i,j]=id.split('-').map(Number);return [c.left[i][0],c.right[j][0]];}),[['A','薬草'],['A','薬草']]);
});
