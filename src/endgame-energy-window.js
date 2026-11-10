export const energyWindowModes={short:{name:'速い設定',power:4,hours:1},long:{name:'ゆっくりの設定',power:3,hours:2}};
export function energyWindowResult(mode){if(!Object.hasOwn(energyWindowModes,mode))throw Error('invalid');const {power,hours}=energyWindowModes[mode],active=power*hours,idle=2*(3-hours);return {active,idle,total:active+idle,finished:hours,withinDeadline:hours<=1.5};}
export function replayEnergyWindow(kind,history){
 if(!['active','idle','compare'].includes(kind)||!Array.isArray(history))return null;
 const modes=['short','long'];let scene=0,tried=[],results=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){tried=[];if(kind!=='compare')scene=0;results=[];continue;}
  if(kind==='compare'){
   if(action==='try:short'||action==='try:long'){const m=action.slice(4);if(!tried.includes(m))tried.push(m);continue;}
   if(action==='answer:short'&&tried.includes('short')&&tried.includes('long')){done=true;continue;}return null;
  }
  const m=modes[scene],r=energyWindowResult(m),expected=kind==='active'?r.active:r.total;
  if(action!==`answer:${expected}`)return null;results.push({mode:m,...r});scene++;done=scene===modes.length;
 }
 return {scene,tried,results,done};
}
