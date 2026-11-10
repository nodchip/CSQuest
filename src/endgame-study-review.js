export const studyOptions={
 explain:[['purpose','目的と何をするか'],['force','断れないと伝える'],['voluntary','参加は自由と伝える'],['record','何を記録し誰が見るか'],['withdraw','途中でやめる方法'],['risk','起こり得る負担や危険'],['contact','質問の連絡先']],
 protect:[['public','個別記録を掲示する'],['limit','見られる担当者を限る'],['duration','保存期間と消去方法を決める'],['separate','番号と名前の対応表を別に守る']]
};
const expected={explain:['purpose','voluntary','record','withdraw','risk','contact'],protect:['limit','duration','separate']};
export const reviewSteps=['submit','revise','resubmit','notice','recruit'];
export function replayStudyReview(kind,history){
 if(!Array.isArray(history)||!['explain','protect','review'].includes(kind))return null;let selected=[],step=0,done=false;
 for(const action of history){if(done||typeof action!=='string')return null;
  if(kind==='review'){if(action!==reviewSteps[step])return null;step++;done=step===reviewSteps.length;continue;}
  if(action.startsWith('toggle:')){const x=action.slice(7);if(!studyOptions[kind].some(([id])=>id===x))return null;selected=selected.includes(x)?selected.filter(v=>v!==x):[...selected,x];continue;}
  if(action==='check'&&selected.length===expected[kind].length&&expected[kind].every(x=>selected.includes(x))){done=true;continue;}
  return null;
 }
 return {selected,step,done};
}
