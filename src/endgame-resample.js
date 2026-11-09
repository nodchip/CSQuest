// This miniature keeps the upper-left pixel of each 2x2 block, then copies it.
export const sampleIndices=[0,2,8,10];
export const imageExamples=[
 Array.from({length:16},(_,i)=>i===5),
 Array.from({length:16},(_,i)=>i===15),
 Array(16).fill(true)
];
export function reduceImage(image){
 if(!Array.isArray(image)||image.length!==16||image.some(x=>typeof x!=='boolean'))return null;
 return sampleIndices.map(i=>image[i]);
}
export function expandImage(image){
 if(!Array.isArray(image)||image.length!==4||image.some(x=>typeof x!=='boolean'))return null;
 return Array.from({length:16},(_,i)=>image[Math.floor(Math.floor(i/4)/2)*2+Math.floor((i%4)/2)]);
}
export function replayResample(history){
 if(!Array.isArray(history))return null;let scene=0,phase='pick',selected=[];const results=[];
 for(const action of history){
  if(scene===3){if(action!=='ambiguous'||phase!=='pick')return null;scene++;continue;}
  if(scene>=3||typeof action!=='string')return null;
  if(phase==='pick'){
   if(action==='reduce'){
    if(selected.length!==4||!sampleIndices.every(i=>selected.includes(i)))return null;
    phase='small';continue;
   }
   const match=/^cell:(0|[1-9]\d*)$/.exec(action);if(!match)return null;const i=Number(match[1]);if(i>=16)return null;
   selected=selected.includes(i)?selected.filter(x=>x!==i):[...selected,i];
  }else if(phase==='small'&&action==='expand')phase='large';
  else if(phase==='large'&&action==='next'){
   const small=reduceImage(imageExamples[scene]),large=expandImage(small);results.push({small,large});scene++;phase='pick';selected=[];
  }else return null;
 }
 return {scene,phase,selected,results,done:scene===4};
}
