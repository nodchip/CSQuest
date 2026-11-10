export const routePrefixTable=[{id:'default',prefix:'',to:'R'},{id:'one',prefix:'10',to:'A'},{id:'two',prefix:'101',to:'B'},{id:'zero',prefix:'0',to:'C'}];
export const routePrefixCases={specific:['1011'],fallback:['1110'],compare:['1011','1001','0110','1110']};
export function matchingPrefix(address){if(!/^[01]{4}$/.test(address))throw Error('invalid');return routePrefixTable.filter(r=>address.startsWith(r.prefix)).map(r=>r.id);}
export function choosePrefix(address){const matches=routePrefixTable.filter(r=>address.startsWith(r.prefix));return matches.reduce((a,b)=>a.prefix.length>b.prefix.length?a:b);}
export function replayRoutePrefix(kind,history){
 if(!Object.hasOwn(routePrefixCases,kind)||!Array.isArray(history))return null;
 const cases=routePrefixCases[kind];let scene=0,selected=[],phase=kind==='compare'?'route':'match',results=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){selected=[];phase=kind==='compare'?'route':'match';continue;}
  const address=cases[scene];
  if(phase==='match'){
   const m=/^toggle:(default|one|two|zero)$/.exec(action);
   if(m){selected=selected.includes(m[1])?selected.filter(id=>id!==m[1]):[...selected,m[1]];continue;}
   if(action==='check'){const expected=matchingPrefix(address);if(selected.length!==expected.length||expected.some(x=>!selected.includes(x)))return null;phase='route';continue;}
   return null;
  }
  const route=choosePrefix(address);if(action!==`route:${route.to}`)return null;
  results.push({address,route:route.id,to:route.to});scene++;selected=[];phase=kind==='compare'?'route':'match';done=scene===cases.length;
 }
 return {scene,selected,phase,results,done};
}
