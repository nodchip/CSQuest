import test from 'node:test';
import assert from 'node:assert/strict';
import {quartileCases,quartileStats,quartileCorrect,createQuartiles,restoreQuartiles,quartileComplete} from '../src/quartiles.js';

test('the documented median-of-halves rule and strict fences produce the expected candidates',()=>{
 for(const [id,item] of Object.entries(quartileCases)){const first=item.values.slice(0,5),last=item.values.slice(5),q1=first[2],q3=last[2],iqr=q3-q1,upper=q3+1.5*iqr,lower=q1-1.5*iqr;assert.deepEqual(quartileStats(id),{q1,q3,iqr,lower,upper,outliers:item.values.filter(x=>x<lower||x>upper)});assert.deepEqual([q1,q3,iqr,lower,upper],[2,6,4,-4,12]);assert.deepEqual(quartileStats(id).outliers,id==='wide'?[]:[30]);}
});
test('both marked ranks, the fence and candidates must be correct; saved choices are validated',()=>{
 const s=createQuartiles();s.choices.wide={q1:2,q3:7,fence:12,outlier:'none',checked:true};s.choices.extreme={q1:2,q3:7,fence:12,outlier:'thirty',checked:true};assert.equal(quartileComplete(s),true);const saved=restoreQuartiles(s);s.choices.wide.q1=3;assert.equal(saved.choices.wide.q1,2);assert.equal(quartileCorrect('wide',s.choices.wide),false);assert.throws(()=>restoreQuartiles({...saved,slot:'bad'}),RangeError);
});
