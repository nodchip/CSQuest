export const projectionRoster=[{person:'アオ',quest:'森'},{person:'アオ',quest:'塔'},{person:'ベニ',quest:'森'},{person:'ベニ',quest:'森'}];
export const rosterProjectionCases={
  nameAll:{label:'名前だけ・重複を残す',columns:['person'],distinct:false},
  nameDistinct:{label:'名前だけ・重複を除く',columns:['person'],distinct:true},
  pairAll:{label:'名前と依頼・重複を残す',columns:['person','quest'],distinct:false},
  pairDistinct:{label:'名前と依頼・重複を除く',columns:['person','quest'],distinct:true}
};
export function rosterProjection(id){
  if(!Object.hasOwn(rosterProjectionCases,id))throw new RangeError('列の選択が不正です。');
  const c=rosterProjectionCases[id],rows=projectionRoster.map(row=>c.columns.map(key=>row[key]));
  return c.distinct?rows.filter((row,i)=>rows.findIndex(other=>other.every((value,j)=>value===row[j]))===i):rows;
}
export function createRosterProjection(){return {selected:'nameAll',choices:Object.fromEntries(Object.keys(rosterProjectionCases).map(id=>[id,{count:null,checked:false}]))};}
export function rosterProjectionCorrect(id,c){return c.checked&&c.count===rosterProjection(id).length;}
export function rosterProjectionComplete(s){return Object.keys(rosterProjectionCases).every(id=>rosterProjectionCorrect(id,s.choices[id]));}
export function restoreRosterProjection(saved){
  if(!saved||!Object.hasOwn(rosterProjectionCases,saved.selected)||!saved.choices)throw new RangeError('列の選択の記録が不正です。');
  const s=createRosterProjection();s.selected=saved.selected;
  for(const id of Object.keys(rosterProjectionCases)){const c=saved.choices[id];if(!c||![null,1,2,3,4].includes(c.count)||typeof c.checked!=='boolean')throw new RangeError('予測が不正です。');s.choices[id]={count:c.count,checked:c.checked};}
  return s;
}
