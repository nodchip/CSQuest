export const textContrastScenes={normal:[{color:'#777777',large:false},{color:'#767676',large:false}],large:[{color:'#777777',large:true},{color:'#aaaaaa',large:true}],compare:[{color:'#777777',large:false},{color:'#777777',large:true}]};
export function contrastOnWhite(hex){
 if(!/^#[0-9a-f]{6}$/i.test(hex))throw new RangeError('色が不正です');
 const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
 const luminance=0.2126*c[0]+0.7152*c[1]+0.0722*c[2];return 1.05/(luminance+0.05);
}
export function replayTextContrast(kind,history){
 if(!Object.hasOwn(textContrastScenes,kind)||!Array.isArray(history)||history.length>20)return null;
 const scenes=textContrastScenes[kind],results=[];let scene=0,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===scenes.length){if(kind!=='compare'||action!=='answer:unrounded')return null;done=true;continue;}
  const item=scenes[scene],ratio=contrastOnWhite(item.color),threshold=item.large?3:4.5,pass=ratio>=threshold;
  if(action!==`answer:${pass?'pass':'fail'}`)return null;
  results.push({...item,ratio,threshold,pass});scene++;if(scene===scenes.length&&kind!=='compare')done=true;
 }
 return {scene,results,done};
}
