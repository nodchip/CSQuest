import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {injectionExample,replayInjection} from '../src/endgame-injection.js';
test('fixed SQLite query matches all modeled outcomes for both ways of supplying input',()=>{
 const code=`import sqlite3,json\nc=sqlite3.connect(':memory:')\nc.execute('create table people(name text)')\nc.executemany('insert into people values (?)',[('アオ',),('ビー',),("オ'ハル",)])\nvalues=['アオ',"オ'ハル","アオ' OR 1=1 -- "]\nout=[]\nfor mode in ['concat','bound']:\n  for value in values:\n    try:\n      q="select name from people where name = "\n      cur=c.execute(q+"'"+value+"'") if mode=='concat' else c.execute(q+'?',(value,))\n      out.append({'rows':[x[0] for x in cur.fetchall()]})\n    except sqlite3.OperationalError:\n      out.append({'error':'構文エラー'})\nprint(json.dumps(out,ensure_ascii=False))`;
 const run=spawnSync(process.platform==='win32'?'python':'python3',['-c',code],{encoding:'utf8',env:{...process.env,PYTHONIOENCODING:'utf-8'}});assert.equal(run.status,0,run.stderr);
 const normalize=x=>x.rows?{rows:[...x.rows].sort()}:x;
 const independent=JSON.parse(run.stdout).map(normalize);assert.deepEqual(independent,[{rows:['アオ']},{error:'構文エラー'},normalize({rows:['アオ','ビー',"オ'ハル"]}),{rows:['アオ']},{rows:["オ'ハル"]},{rows:[]}]);
 assert.deepEqual(['concat','bound'].flatMap(mode=>[0,1,2].map(i=>normalize(injectionExample(mode,i)))),independent);
});
test('all examples must be tried, and the explanation can be corrected',()=>{
 assert.equal(replayInjection('concat',['try:0','answer:structure','check']),null);
 const wrong=['try:0','try:1','try:2','answer:literal'];assert.equal(replayInjection('concat',[...wrong,'check']),null);
 const saved=JSON.parse(JSON.stringify(wrong));assert.deepEqual(replayInjection('concat',saved).tested,[0,1,2]);
 const done=[...saved,'answer:structure','check'];assert.equal(replayInjection('concat',done).done,true);assert.equal(replayInjection('concat',[...done,'try:0']),null);
 assert.equal(replayInjection('bound',['try:0','try:1','try:2','answer:literal','check']).done,true);
});
test('switching method clears trials and the comparison requires bound values',()=>{
 const wrong=['mode:concat','try:0','try:1','try:2'];assert.equal(replayInjection('choose',[...wrong,'check']),null);
 const changed=[...wrong,'mode:bound'];assert.deepEqual(replayInjection('choose',changed).tested,[]);
 assert.equal(replayInjection('choose',[...changed,'try:0','try:1','try:2','check']).done,true);
});
