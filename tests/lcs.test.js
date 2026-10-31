import test from 'node:test';
import assert from 'node:assert/strict';
import {lcsCases,createLcsTrial,selectLcs,stepLcs,createLcsSet,lcsComplete,restoreLcsSet} from '../src/lcs.js';

function subsequence(s,t){let i=0;for(const c of t)if(c===s[i])i++;return i===s.length;}
function brute(a,b){let best=0;for(let mask=0;mask<(1<<a.length);mask++){let candidate='';for(let i=0;i<a.length;i++)if(mask&(1<<i))candidate+=a[i];if(subsequence(candidate,b))best=Math.max(best,candidate.length);}return best;}
test('table and a valid traceback recover an independently checked longest subsequence',()=>{
  const all=createLcsSet();for(const [id,{a,b}] of Object.entries(lcsCases)){let s=createLcsTrial(id);for(let i=1;i<=3;i++)for(let j=1;j<=3;j++){const value=a[i-1]===b[j-1]?s.grid[i-1][j-1]+1:Math.max(s.grid[i-1][j],s.grid[i][j-1]);s=stepLcs(s,`set:${i}:${j}:${value}`);}s=stepLcs(s,'trace');while(s.phase==='trace'){const same=a[s.i-1]===b[s.j-1],move=same?'diag':s.grid[s.i-1][s.j]===s.grid[s.i][s.j]?'up':'left';s=stepLcs(s,move);}const result=s.reverse.slice().reverse().join('');assert.ok(subsequence(result,a)&&subsequence(result,b));assert.equal(result.length,brute(a,b));all.trials[id]=s;}assert.ok(lcsComplete(all));
});
test('dependencies and numeric answers are checked and partial selection restores',()=>{
  let s=createLcsTrial('first');assert.equal(selectLcs(s,3,3).selected,null);s=selectLcs(s,1,1);assert.deepEqual(s.selected,[1,1]);assert.equal(stepLcs(s,'set:1:1:0').history.length,0);s=stepLcs(s,'set:1:1:1');const saved={selected:'first',histories:{first:s.history,second:[]},selections:{first:[1,2],second:null}};assert.deepEqual(restoreLcsSet(saved).trials.first.selected,[1,2]);assert.throws(()=>restoreLcsSet({...saved,histories:{...saved.histories,first:['set:3:3:2']}}));
});
test('both equal-length traceback branches yield valid distinct answers',()=>{
  let start=createLcsTrial('first');const {a,b}=lcsCases.first;for(let i=1;i<=3;i++)for(let j=1;j<=3;j++){const value=a[i-1]===b[j-1]?start.grid[i-1][j-1]+1:Math.max(start.grid[i-1][j],start.grid[i][j-1]);start=stepLcs(start,`set:${i}:${j}:${value}`);}start=stepLcs(start,'trace');const answers=[];for(const first of ['up','left']){let s=stepLcs(start,first);assert.equal(s.history.length,start.history.length+1);while(s.phase==='trace'){const same=a[s.i-1]===b[s.j-1];s=stepLcs(s,same?'diag':s.grid[s.i-1][s.j]===s.grid[s.i][s.j]?'up':'left');}answers.push(s.reverse.slice().reverse().join(''));}assert.deepEqual(new Set(answers),new Set(['AB','AC']));
});
