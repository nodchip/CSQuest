// Page-number to frame-number mapping only; page offsets are outside this model.
export const pageTables={A:{0:2,1:1},B:{0:0}};
export const pageCases=[['A',0],['B',0],['A',1],['B',1]];
export function replayPages(history){
 if(!Array.isArray(history))return null;
 const results=[];
 for(const [index,action] of history.entries()){
  const task=pageCases[index];if(!task||typeof action!=='string')return null;
  const [tool,page]=task,frame=pageTables[tool][page],expected=frame===undefined?'unmapped':`frame:${frame}`;
  if(action!==expected)return null;results.push(frame??null);
 }
 return {scene:history.length,results,done:history.length===pageCases.length};
}
