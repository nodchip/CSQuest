export const groupLedgerRows=[{id:'a1',area:'A',quantity:2},{id:'a2',area:'A',quantity:2},{id:'a3',area:'A',quantity:null},{id:'b1',area:'B',quantity:3},{id:'b2',area:'B',quantity:3},{id:'c1',area:'C',quantity:null}];
export function groupLedgerStats(rows,area){const group=rows.filter(r=>r.area===area),values=group.map(r=>r.quantity).filter(v=>v!==null);return {all:group.length,present:values.length,sum:values.length?values.reduce((a,b)=>a+b,0):null};}
export function replayGroupLedger(kind,history){
 if(!['count','sum','compare'].includes(kind)||!Array.isArray(history))return null;
 let scene=0,phase=kind==='count'?'all':kind==='sum'?'sum':'where',selected=[],results=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){scene=0;phase=kind==='count'?'all':kind==='sum'?'sum':'where';selected=[];results=[];continue;}
  if(kind==='compare'){
   const options=phase==='where'?groupLedgerRows.map(r=>r.id):['A','B','C'];
   if(action.startsWith('toggle:')){const id=action.slice(7);if(!options.includes(id))return null;selected=selected.includes(id)?selected.filter(x=>x!==id):[...selected,id];continue;}
   if(action!=='check')return null;
   const expected=phase==='where'?groupLedgerRows.filter(r=>r.quantity!==null&&r.quantity>=3).map(r=>r.id):['A','B','C'].filter(area=>{const value=groupLedgerStats(groupLedgerRows,area).sum;return value!==null&&value>=3;});
   if(expected.length!==selected.length||expected.some(x=>!selected.includes(x)))return null;
   results.push({phase,selected:[...expected]});selected=[];if(phase==='where')phase='having';else done=true;continue;
  }
  const area=['A','C'][scene],stats=groupLedgerStats(groupLedgerRows,area),value=phase==='all'?stats.all:phase==='present'?stats.present:stats.sum;
  if(action!==`answer:${value===null?'null':value}`)return null;
  if(phase==='all'){phase='present';continue;}
  results.push({area,...stats});scene++;if(scene===2)done=true;else phase=kind==='count'?'all':'sum';
 }
 return {scene,phase,selected,results,done};
}
