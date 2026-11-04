export const skipBlocks={
  first:[{id:'A',delivery:{count:1}},{id:'B',delivery:{count:3}}],
  second:[{id:'C',delivery:{count:4}},{id:'D',delivery:{count:6}}],
  third:[{id:'E',delivery:{count:2}},{id:'F',delivery:{count:8}}]
};
export const skipThresholds=[3,5,7];
export function skipIndexQuery(threshold){
 if(!Number.isInteger(threshold))throw new RangeError('境界が不正です。');
 const blocks=Object.entries(skipBlocks).map(([id,docs])=>({id,min:Math.min(...docs.map(d=>d.delivery.count)),max:Math.max(...docs.map(d=>d.delivery.count)),docs}));
 const skipped=blocks.filter(b=>b.max<threshold),kept=blocks.filter(b=>b.max>=threshold);
 const candidates=kept.flatMap(b=>b.docs),matches=candidates.filter(d=>d.delivery.count>=threshold);
 return {blocks,skipped:skipped.map(b=>b.id),candidates:candidates.map(d=>d.id),matches:matches.map(d=>d.id)};
}
export function skipAfterUpdate(mode){
 if(!['stale','fresh'].includes(mode))throw new RangeError('要約の選択が不正です。');
 const blocks=structuredClone(skipBlocks);blocks.first[1].delivery.count=7;
 const maxima={first:mode==='stale'?3:7,second:6,third:8};
 const candidates=Object.entries(blocks).filter(([id])=>maxima[id]>=7).flatMap(([,docs])=>docs);
 const actual=Object.values(blocks).flat().filter(d=>d.delivery.count>=7).map(d=>d.id);
 return {candidates:candidates.map(d=>d.id),matches:candidates.filter(d=>d.delivery.count>=7).map(d=>d.id),actual};
}
export function createSkipExercise(){return {threshold:3,answers:Object.fromEntries(skipThresholds.map(n=>[n,{guess:null,checked:false}])),maintenance:{mode:'stale',guess:null,checked:false}};}
export function restoreSkipExercise(saved){
 if(saved===undefined)return createSkipExercise();
 if(!saved||!skipThresholds.includes(saved.threshold)||!saved.answers)throw new RangeError('索引の記録が不正です。');
 const s=createSkipExercise();s.threshold=saved.threshold;
 for(const n of skipThresholds){const a=saved.answers[n];if(!a||!(a.guess===null||[0,1,2].includes(a.guess))||typeof a.checked!=='boolean'||(a.checked&&a.guess===null))throw new RangeError('索引の記録が不正です。');s.answers[n]={guess:a.guess,checked:a.checked};}
 if(saved.maintenance!==undefined){const m=saved.maintenance;if(!m||!['stale','fresh'].includes(m.mode)||![null,'found','missed'].includes(m.guess)||typeof m.checked!=='boolean'||(m.checked&&!m.guess))throw new RangeError('要約の記録が不正です。');s.maintenance={mode:m.mode,guess:m.guess,checked:m.checked};}
 return s;
}
