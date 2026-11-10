const ascending=[{id:'A',x:1,y:1},{id:'B',x:2,y:2},{id:'C',x:3,y:3}];
const descending=[{id:'A',x:1,y:3},{id:'B',x:2,y:2},{id:'C',x:3,y:1}];
const mixed=[{id:'A',x:1,y:3},{id:'B',x:2,y:1},{id:'C',x:3,y:2}];
export const scatterCases={rising:[ascending],falling:[descending],compare:[ascending,mixed]};
export function replayScatter(kind,history){
 if(!Object.hasOwn(scatterCases,kind)||!Array.isArray(history))return null;
 const cases=scatterCases[kind];let scene=0,selected=null,placed={},results=[],answers=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===cases.length){
   if(kind!=='compare')return null;
   if(answers.length===0&&action==='answer:different'){answers.push(action);continue;}
   if(answers.length===1&&action==='answer:no-cause'){answers.push(action);done=true;continue;}
   return null;
  }
  const cards=cases[scene];
  if(action==='reset'){selected=null;placed={};continue;}
  if(action==='check'){
   if(Object.keys(placed).length!==cards.length)return null;
   results.push(cards.map(c=>({id:c.id,x:c.x,y:c.y})));scene++;selected=null;placed={};if(scene===cases.length&&kind!=='compare')done=true;continue;
  }
  const s=/^select:([ABC])$/.exec(action);
  if(s){if(Object.hasOwn(placed,s[1]))return null;selected=s[1];continue;}
  const cell=/^point:([123]):([123])$/.exec(action),card=cards.find(c=>c.id===selected);
  if(!cell||!card||card.x!==Number(cell[1])||card.y!==Number(cell[2]))return null;
  placed[selected]={x:card.x,y:card.y};selected=null;
 }
 return {scene,selected,placed,results,answers,done};
}
