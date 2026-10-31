import test from 'node:test';
import assert from 'node:assert/strict';
import {pathEdges,createRecursivePath,deriveRecursivePath,checkRecursivePath,recursivePathComplete,restoreRecursivePath} from '../src/recursive-path.js';

test('base and recursive rule derive precisely the compatible extensions',()=>{
  let state=createRecursivePath();
  for(let edge=0;edge<pathEdges.length;edge++)state=deriveRecursivePath({...state,mode:'base',edge});
  for(let i=0;i<state.paths.length;i++)for(let edge=0;edge<pathEdges.length;edge++){
    const before=state.paths.length,path=state.paths[i],next=deriveRecursivePath({...state,mode:'extend',path:i,edge});
    const expected=path.at(-1)===pathEdges[edge][0]&&!state.paths.some(p=>p.join()===path.concat(pathEdges[edge][1]).join());
    assert.equal(next.paths.length,before+Number(expected));state=next;
  }
  assert.ok(state.paths.some(p=>p.join()==='a,d,e,f'));
  assert.ok(state.paths.some(p=>p.join()==='a,b,c'));
  assert.equal(recursivePathComplete(checkRecursivePath(state)),true);
});
test('saved recursive proofs require a previous prefix and reject duplicates',()=>{
  const initial=createRecursivePath();
  const saved={...initial,paths:[['a','d'],['a','d','e'],['a','d','e','f'],['a','b'],['a','b','c']],checked:true};
  assert.equal(recursivePathComplete(restoreRecursivePath(saved)),true);
  assert.throws(()=>restoreRecursivePath({...saved,paths:[['a','d','e']]}));
  assert.throws(()=>restoreRecursivePath({...saved,paths:[['a','d'],['a','d']]}));
  assert.throws(()=>restoreRecursivePath({...saved,paths:[['a','f']]}));
});
