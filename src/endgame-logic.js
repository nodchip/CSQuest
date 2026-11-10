export const logicCases={
 derive:[{care:[['アオ','赤'],['ビー','青']],bloom:['赤']},{care:[['アオ','青'],['ビー','赤']],bloom:['赤']}],
 unify:[{pattern:['X','X'],target:['アオ','アオ']},{pattern:['X','X'],target:['アオ','ビー']},{pattern:['X','赤'],target:['ビー','赤']},{pattern:['赤','X'],target:['ビー','赤']}],
 combine:[{care:[['アオ','赤'],['ビー','青']],bloom:['赤']},{care:[['アオ','赤'],['ビー','青']],bloom:['青']},{care:[['アオ','赤'],['ビー','青']],bloom:[]}]
};
// X denotes the same variable in each position; all other values are constants.
export function unifyExample(pattern,target){
 if(pattern.length!==target.length)return null;let value=null;
 for(let i=0;i<pattern.length;i++){if(pattern[i]==='X'){if(value!==null&&value!==target[i])return null;value=target[i];}else if(pattern[i]!==target[i])return null;}
 return value;
}
export function derived(c){return c.care.filter(([,flower])=>c.bloom.includes(flower));}
export function replayLogic(kind,history){
 const cases=logicCases[kind];if(!cases||!Array.isArray(history))return null;let scene=0,person=null,flower=null,answer=null,results=[];
 for(const action of history){const c=cases[scene];if(!c||typeof action!=='string')return null;
  if(action==='reset'){person=null;flower=null;answer=null;continue;}
  if(kind==='combine'&&action.startsWith('person:')&&['アオ','ビー','なし'].includes(action.slice(7))){person=action.slice(7);flower=null;continue;}
  if(kind==='combine'&&action.startsWith('flower:')&&['赤','青'].includes(action.slice(7))&&person&&person!=='なし'){flower=action.slice(7);continue;}
  if(kind!=='combine'&&action.startsWith('answer:')&&['アオ','ビー','なし'].includes(action.slice(7))){answer=action.slice(7);continue;}
  if(action==='check'){
   const expected=kind==='unify'?unifyExample(c.pattern,c.target):derived(c)[0]??null;
   const correct=kind==='unify'?answer===(expected??'なし'):kind==='derive'?answer===(expected?.[0]??'なし'):expected?person===expected[0]&&flower===expected[1]:person==='なし';
   if(!correct)return null;results.push(expected);scene++;person=null;flower=null;answer=null;continue;
  }
  return null;
 }
 return {scene,person,flower,answer,results,done:scene===cases.length};
}
