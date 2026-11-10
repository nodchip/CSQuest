export const invariantInputs=[['赤','青','赤'],[]];
export const proofCards=[
 '初めは i=0、c=0。先頭０枚の赤も０枚です。',
 'i＜n なら i を１増やしても i≤n。次が赤なら c も１増やすので、先頭 i 枚の赤を数えています。',
 'i=n で止まるので、c はすべての札に含まれる赤の数です。',
 '残り n−i は整数で０以上。繰り返す前は正で、毎回１減るため、いつか終了します。'
];
export function replayInvariant(kind,history){
 if(!['trace','proof','compare'].includes(kind)||!Array.isArray(history))return null;
 let scene=0,i=0,c=0,correct=0,wrong=0,proof=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(kind==='trace'){
   const seq=invariantInputs[scene];
   if(action==='step'&&i<seq.length){if(seq[i]==='赤')c++;i++;continue;}
   if(action==='reset'){i=0;c=0;continue;}
   if(action==='check'&&i===seq.length){scene++;if(scene===invariantInputs.length)done=true;else{i=0;c=0;}continue;}
   return null;
  }
  if(kind==='proof'){
   const card=/^card:([0-3])$/.exec(action);
   if(card&&Number(card[1])===proof.length){proof.push(Number(card[1]));continue;}
   if(action==='reset'){proof=[];continue;}
   if(action==='check'&&proof.length===proofCards.length){done=true;continue;}
   return null;
  }
  const seq=invariantInputs[0];
  if(action==='step-wrong'&&wrong<seq.length-1){wrong++;continue;}
  if(action==='step-correct'&&correct<seq.length){correct++;continue;}
  if(action==='reset'){wrong=0;correct=0;continue;}
  if(action==='check'&&wrong===seq.length-1&&correct===seq.length){done=true;continue;}
  return null;
 }
 return {scene,i,c,proof,wrong,correct,wrongCount:invariantInputs[0].slice(0,wrong).filter(x=>x==='赤').length,correctCount:invariantInputs[0].slice(0,correct).filter(x=>x==='赤').length,done};
}
