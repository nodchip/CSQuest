// The examples use a unique single-number destination key, no null values,
// and refuse deletion while any parcel still refers to a destination.
export const integrityCases=[
 {destinations:[10,20],parcels:[['A',10]],goal:'parcel:B:20'},
 {destinations:[10,20],parcels:[['A',10]],goal:'destination:30'},
 {destinations:[10,20],parcels:[['A',10]],goal:'delete:20'}
];
export function applyIntegrity(data,action){
 const parts=typeof action==='string'?action.split(':'):[];
 const destinations=[...data.destinations],parcels=data.parcels.map(row=>[...row]);
 if(parts[0]==='parcel'&&parts.length===3&&/^[A-Z]$/.test(parts[1])&&/^\d+$/.test(parts[2])){
  const id=parts[1],destination=Number(parts[2]);
  if(parcels.some(row=>row[0]===id))return {ok:false,reason:'同じ荷物番号がすでにあります。'};
  if(!destinations.includes(destination))return {ok:false,reason:'届け先の番号が登録されていません。'};
  parcels.push([id,destination]);return {ok:true,destinations,parcels};
 }
 if(parts[0]==='destination'&&parts.length===2&&/^\d+$/.test(parts[1])){
  const id=Number(parts[1]);if(destinations.includes(id))return {ok:false,reason:'同じ届け先番号がすでにあります。'};
  destinations.push(id);return {ok:true,destinations,parcels};
 }
 if(parts[0]==='delete'&&parts.length===2&&/^\d+$/.test(parts[1])){
  const id=Number(parts[1]);if(!destinations.includes(id))return {ok:false,reason:'その届け先はありません。'};
  if(parcels.some(row=>row[1]===id))return {ok:false,reason:'その届け先を参照する荷物が残っています。'};
  return {ok:true,destinations:destinations.filter(x=>x!==id),parcels};
 }
 return {ok:false,reason:'操作を確かめましょう。'};
}
export function replayIntegrity(history){
 if(!Array.isArray(history))return null;
 let scene=0;const completed=[];
 for(const action of history){
  const c=integrityCases[scene];if(!c||typeof action!=='string'||!applyIntegrity(c,action).ok||action!==c.goal)return null;
  completed.push(action);scene++;
 }
 return {scene,completed,done:scene===integrityCases.length};
}
