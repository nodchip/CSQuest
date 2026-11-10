export const stringCases={
 split:[
  {input:'港|森',goal:'区切り「|」で分け、[港, 森] にする。',wanted:['split']},
  {input:'港||森',goal:'区切り「|」で分け、空欄を残して [港, 空欄, 森] にする。',wanted:['split']}
 ],
 replace:[
  {input:'赤・赤',goal:'「赤」を左から最初の１つだけ「青」に替え、青・赤 にする。',wanted:['first']},
  {input:'赤・赤',goal:'「赤」をすべて「青」に替え、青・青 にする。',wanted:['all']},
  {input:'森・港',goal:'「赤」をすべて「青」に替えた結果を確かめる。',wanted:['all']}
 ],
 pipeline:[
  {input:' 水辺 | 街 ',goal:'項目ごとの前後の半角空白を除き、空欄も除いて [水辺, 街] にする。',wanted:['split','trim','remove']},
  {input:' 港 | | 森 ',goal:'項目ごとの前後の半角空白を除き、空欄も除いて [港, 森] にする。',wanted:['split','trim','remove']}
 ]
};
const allowed={split:['split'],replace:['first','all'],pipeline:['split','trim','remove']};
export function replayStrings(kind,history){
 const cases=stringCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,ops=[],value=cases[0].input,done=false;
 function run(){let v=cases[scene].input;for(const op of ops){
  if(op==='split'){if(typeof v!=='string')return null;v=v.split('|');}
  else if(op==='first'){if(typeof v!=='string')return null;v=v.replace('赤','青');}
  else if(op==='all'){if(typeof v!=='string')return null;v=v.replaceAll('赤','青');}
  else if(op==='trim'){if(!Array.isArray(v))return null;v=v.map(x=>x.replace(/^ +| +$/g,''));}
  else if(op==='remove'){if(!Array.isArray(v))return null;v=v.filter(x=>x!=='');}
 }return v;}
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='undo'){if(!ops.length)return null;ops.pop();value=run();continue;}
  if(action==='check'){const expected=cases[scene].wanted;if(ops.length!==expected.length||!ops.every((x,i)=>x===expected[i]))return null;scene++;done=scene===cases.length;if(!done){ops=[];value=cases[scene].input;}continue;}
  if(!action.startsWith('op:')||!allowed[kind].includes(action.slice(3))||ops.length>=6)return null;
  ops.push(action.slice(3));value=run();if(value===null)return null;
 }
 return {scene,ops,value,done};
}
