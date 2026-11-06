import {test} from 'node:test';
import assert from 'node:assert/strict';
import {solidModes,solidContains,solidExpected,solidCreate,solidCorrect,solidRestore} from '../src/solid-csg.js';

test('cube and sphere samples have the expected sets and ordered differences',()=>{
  const all=Array.from({length:27},(_,i)=>solidContains(i%3,Math.floor(i/3)%3,Math.floor(i/9)));
  assert.equal(all.filter(p=>p.a).length,8);assert.equal(all.filter(p=>p.b).length,7);
  const expected={union:11,intersection:4,aMinusB:4,bMinusA:3};
  for(const mode of Object.keys(solidModes)){
    assert.equal([0,1,2].reduce((n,z)=>n+solidExpected(mode,z).length,0),expected[mode]);
    for(let z=0;z<3;z++)for(let i=0;i<9;i++){
      const {a,b}=all[z*9+i], truth={union:a||b,intersection:a&&b,aMinusB:a&&!b,bMinusA:b&&!a};
      assert.equal(solidExpected(mode,z).includes(i),truth[mode]);
    }
  }
  assert.throws(()=>solidContains(-1,0,0));assert.throws(()=>solidExpected('toString',0));
});

test('each slice requires an exact checked selection and old state is copied safely',()=>{
 const s=solidCreate();
 for(const mode of Object.keys(solidModes))for(let z=0;z<3;z++){
  const expected=solidExpected(mode,z),t=s.trials[mode][z];t.selected=expected;
  assert.equal(solidCorrect(mode,z,t),false);t.checked=true;assert.equal(solidCorrect(mode,z,t),true);
  for(let i=0;i<9;i++){const changed=expected.includes(i)?expected.filter(n=>n!==i):[...expected,i];assert.equal(solidCorrect(mode,z,{selected:changed,checked:true}),false);}
 }
 const copy=solidRestore(s);copy.trials.union[0].selected.pop();assert.notDeepEqual(copy,s);
 copy.trials.union[0].selected=[1,1];assert.throws(()=>solidRestore(copy));
});
