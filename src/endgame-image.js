export const fitScenes=[
 {width:4,height:2,goal:'whole-and-full'},
 {width:4,height:4,goal:'whole-and-shape'},
 {width:4,height:4,goal:'full-and-shape'},
 {width:4,height:4,goal:'whole-and-full'}
];
// A fixed 8x4 source, square pixels, centred output and integer example frames.
export function fitImage(width,height,mode){
 if(![[4,2],[4,4]].some(([w,h])=>w===width&&h===height)||!['contain','crop','stretch'].includes(mode))return null;
 const same=width*4===height*8;
 return {whole:mode!=='crop'||same,full:mode!=='contain'||same,shape:mode!=='stretch'||same};
}
export function replayFit(history){
 if(!Array.isArray(history))return null;let scene=0,mode='contain';const results=[];
 for(const action of history){
  const task=fitScenes[scene];if(!task||typeof action!=='string')return null;
  if(action==='run'){
   const result=fitImage(task.width,task.height,mode),ok=task.goal==='whole-and-full'?result.whole&&result.full:task.goal==='whole-and-shape'?result.whole&&result.shape:result.full&&result.shape;
   if(!ok)return null;results.push({mode,...result});scene++;mode='contain';
  }else if(['contain','crop','stretch'].includes(action))mode=action;else return null;
 }
 return {scene,mode,results,done:scene===fitScenes.length};
}
export const pixelScenes=[{width:4,height:2,column:1},{width:8,height:4,column:3}];
export function replayPixels(history){
 if(!Array.isArray(history))return null;let scene=0,painted=[];
 for(const action of history){
  if(scene<2){
   const task=pixelScenes[scene];if(typeof action!=='string')return null;
   if(action==='run'){
    const target=Array.from({length:task.height},(_,y)=>y*task.width+task.column);
    if(painted.length!==target.length||!target.every(i=>painted.includes(i)))return null;
    scene++;painted=[];continue;
   }
   const match=/^cell:(0|[1-9]\d*)$/.exec(action);if(!match)return null;const i=Number(match[1]);if(i>=task.width*task.height)return null;
   painted=painted.includes(i)?painted.filter(x=>x!==i):[...painted,i];
  }else if(scene===2&&action==='narrow-eight')scene++;
  else return null;
 }
 return {scene,painted,done:scene===3};
}
