import {splitAndJoin} from './decomposition.js';
export const ledgerPairs=['O1,V1','O1,V2','O2,V1','O2,V2','O3,V1','O3,V2'];
export function replayLedgerDecomposition(kind,history){
 if(!['update','village','name'].includes(kind)||!Array.isArray(history)||history.length>40)return null;
 let phase=0,done=false;const selected=[];
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(kind==='update'){
   if(phase===0&&action==='update:O1'){phase=1;continue;}
   if(phase===1&&action==='answer:inconsistent'){done=true;continue;}return null;
  }
  if(phase===0){
   if(action==='check'){
    const expected=splitAndJoin(kind).map(r=>`${r.order},${r.village}`);
    if(expected.length!==selected.length||expected.some(v=>!selected.includes(v)))return null;phase=1;
   }else{const m=/^pair:(O[1-3],V[12])$/.exec(action);if(!m||!ledgerPairs.includes(m[1]))return null;const i=selected.indexOf(m[1]);if(i<0)selected.push(m[1]);else selected.splice(i,1);}
  }else if(action===(kind==='village'?'answer:restored':'answer:spurious'))done=true;
  else return null;
 }
 return {kind,phase,selected,done,rows:kind==='update'?null:splitAndJoin(kind)};
}
