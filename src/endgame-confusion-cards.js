export const confusionData={narrow:{actual:[1,2,3,4],predicted:[1,2,3,5]},wide:{actual:[1,2,3,4],predicted:[1,2,3,4,5,6]}};
export function confusionCell(kind,n){if(!Object.hasOwn(confusionData,kind)||!Number.isInteger(n)||n<1||n>8)throw new RangeError('札が不正です');const x=confusionData[kind],actual=x.actual.includes(n),predicted=x.predicted.includes(n);return actual?(predicted?'tp':'fn'):(predicted?'fp':'tn');}
export function replayConfusionCards(kind,history){
 if(!['narrow','wide','compare'].includes(kind)||!Array.isArray(history)||history.length>30)return null;
 let cards=[],step=0,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){cards=[];step=0;continue;}
  if(kind==='compare'){const expected=['recall:wide','precision:narrow'];if(action!==expected[step])return null;step++;done=step===expected.length;continue;}
  const m=/^place:(tp|fp|fn|tn)$/.exec(action);if(m&&cards.length<8&&m[1]===confusionCell(kind,cards.length+1)){cards.push(m[1]);continue;}
  if(action==='check'&&cards.length===8){done=true;continue;}return null;
 }
 return {cards,step,done};
}
export function advanceConfusionCards(kind,history,action){const p=replayConfusionCards(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayConfusionCards(kind,next)?next:null;}
