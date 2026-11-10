import {eventCards} from './event-independence.js';
export function replayEventIndependence(kind,history){
 if(!['balanced','linked','disjoint'].includes(kind)||!Array.isArray(history)||history.length>40)return null;
 const cards=eventCards(kind),selected=[];let phase=0,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(phase===0){
   if(action==='check'){
    const both=cards.flatMap((c,i)=>c.sun&&c.bell?[i]:[]);if(selected.length!==both.length||both.some(i=>!selected.includes(i)))return null;phase=1;
   }else{const m=/^toggle:([0-7])$/.exec(action);if(!m)return null;const n=Number(m[1]),i=selected.indexOf(n);if(i<0)selected.push(n);else selected.splice(i,1);}
  }else if(phase===1){const correct=kind==='balanced'?'relation:independent':'relation:dependent';if(action!==correct)return null;phase=2;if(kind!=='disjoint')done=true;}
  else if(action==='answer:exclusive-dependent')done=true;
  else return null;
 }
 const overlap=cards.filter(c=>c.sun&&c.bell).length;
 return {cards,selected,phase,done,overlap,sun:cards.filter(c=>c.sun).length,bell:cards.filter(c=>c.bell).length,total:cards.length};
}
