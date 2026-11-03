import test from 'node:test';
import assert from 'node:assert/strict';
import {linearStoryCreate,linearStoryResult,linearStoryDone,linearStoryRestore} from '../src/linear-story.js';

test('each of the two reports has exactly one valid bag count in the selectable range',()=>{
 for(const [id,coeff,actual,solution] of [['bridge',[2,1,1,2],(x,y)=>[2*x+y,x+2*y],[3,2]],['shelter',[3,1,1,2],(x,y)=>[3*x+y,x+2*y],[1,3]]]){
  const answers=[];
  for(let x=0;x<=5;x++)for(let y=0;y<=5;y++){
   const result=linearStoryResult(id,{coeff,x,y});
   assert.deepEqual(result.actual,actual(x,y));
   if(result.solved)answers.push([x,y]);
  }
  assert.deepEqual(answers,[solution]);
  for(let i=0;i<4;i++)for(let n=0;n<4;n++)if(n!==coeff[i]){
   const wrong=[...coeff];wrong[i]=n;
   assert.equal(linearStoryResult(id,{coeff:wrong,x:solution[0],y:solution[1]}).solved,false);
  }
 }
});

test('completion requires both checked problems and saved state is validated and copied',()=>{
 const q=linearStoryCreate();
 q.trials.bridge={coeff:[2,1,1,2],x:3,y:2,checked:true};
 q.trials.shelter={coeff:[3,1,1,2],x:1,y:3,checked:false};
 assert.equal(linearStoryDone(q),false);
 q.trials.shelter.checked=true;assert.equal(linearStoryDone(q),true);
 const restored=linearStoryRestore(q);restored.trials.bridge.coeff[0]=0;assert.equal(q.trials.bridge.coeff[0],2);
 q.trials.bridge.coeff[0]=4;assert.throws(()=>linearStoryRestore(q));
});
