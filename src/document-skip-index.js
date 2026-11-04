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
export function createSkipExercise(){return {threshold:3,answers:Object.fromEntries(skipThresholds.map(n=>[n,{guess:null,checked:false}]))};}
export function restoreSkipExercise(saved){
 if(saved===undefined)return createSkipExercise();
 if(!saved||!skipThresholds.includes(saved.threshold)||!saved.answers)throw new RangeError('索引の記録が不正です。');
 const s=createSkipExercise();s.threshold=saved.threshold;
 for(const n of skipThresholds){const a=saved.answers[n];if(!a||!(a.guess===null||[0,1,2].includes(a.guess))||typeof a.checked!=='boolean'||(a.checked&&a.guess===null))throw new RangeError('索引の記録が不正です。');s.answers[n]={guess:a.guess,checked:a.checked};}
 return s;
}
