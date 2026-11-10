export const colorCases={
 light:[{target:6,name:'黄'},{target:7,name:'白'},{target:0,name:'黒'}],
 filter:[{target:2,name:'緑'},{target:1,name:'青'},{target:7,name:'白'}],
 compare:[{target:2,name:'緑'},{target:1,name:'青'}]
};
const componentBits={R:4,G:2,B:1,C:4,M:2,Y:1};
export function replayColor(kind,history){
 const cases=colorCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,mode=kind==='filter'?'cmy':'rgb',rgb=0,cmy=0,recorded={rgb:false,cmy:false},done=false;
 const output=()=>mode==='rgb'?rgb:(~cmy)&7;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(kind==='compare'&&(action==='mode:rgb'||action==='mode:cmy')){mode=action.slice(5);continue;}
  const m=/^toggle:(R|G|B|C|M|Y)$/.exec(action);
  if(m){const component=m[1];if(!(mode==='rgb'?'RGB':'CMY').includes(component))return null;const bit=componentBits[component];if(mode==='rgb')rgb^=bit;else cmy^=bit;recorded[mode]=false;continue;}
  if(kind==='compare'&&action==='record'&&output()===cases[scene].target){recorded[mode]=true;continue;}
  if(action==='check'&&(kind==='compare'?recorded.rgb&&recorded.cmy:output()===cases[scene].target)){
   scene++;done=scene===cases.length;if(!done){mode=kind==='filter'?'cmy':'rgb';rgb=0;cmy=0;recorded={rgb:false,cmy:false};}continue;
  }
  return null;
 }
 return {scene,mode,rgb,cmy,recorded,output:output(),done};
}
export function colorHex(bits){return '#'+[4,2,1].map(bit=>bits&bit?'ff':'00').join('');}
