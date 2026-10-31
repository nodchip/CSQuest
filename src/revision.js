export const revisionLevel={id:'guild-revisions',number:'59',kind:'revision',name:'二人で直す祭りの記録',tag:'版管理と変更の統合',title:'分かれた記録をひとつに',story:'祭りの担当者が同じ記録を別々に直しました。元の記録と二人の変更を比べ、両方の意図が届くようにまとめましょう。'};
export const revisionCases={
  independent:{name:'別々の項目',fields:[{id:'flag',name:'旗の色',base:'赤',ours:'青',theirs:'赤'},{id:'lamps',name:'灯りの数',base:'２',ours:'２',theirs:'３'}]},
  same:{name:'同じ変更',fields:[{id:'gate',name:'集合する門',base:'北',ours:'南',theirs:'南'}]},
  conflict:{name:'違う変更',fields:[{id:'signal',name:'合図の色',base:'赤',ours:'青',theirs:'緑',resolution:'緑'}],request:'祭りの代表者は、合図を緑にしたいと伝えています。'}
};
export function mergeField(base,ours,theirs){if(ours===theirs)return ours;if(ours===base)return theirs;if(theirs===base)return ours;return null;}
export function createRevision(){return {selected:'independent',choices:Object.fromEntries(Object.entries(revisionCases).map(([id,c])=>[id,Object.fromEntries(c.fields.map(f=>[f.id,'']))])),resolution:'',checked:{independent:false,same:false,conflict:false}};}
export function revisionResults(id,state){if(!Object.hasOwn(revisionCases,id))throw new RangeError('未知の記録です。');return revisionCases[id].fields.map(f=>{const result=mergeField(f.base,f.ours,f.theirs),hint=f.ours===f.theirs?'二人の値が同じか比べましょう。':f.ours===f.base||f.theirs===f.base?'元と比べ、どちらが変更したか確認しましょう。':'二人とも元から異なる値に変えています。';return {id:f.id,expected:result===null?'conflict':result,correct:state.choices[id][f.id]===(result===null?'conflict':result),hint};});}
export function revisionCorrect(id,state){const rows=revisionResults(id,state);return rows.every(row=>row.correct)&&(id!=='conflict'||state.resolution===revisionCases.conflict.fields[0].resolution);}
export function restoreRevision(saved){
  if(!saved||!Object.hasOwn(revisionCases,saved.selected)||!saved.choices||!saved.checked||!['','青','緑'].includes(saved.resolution))throw new RangeError('途中記録が不正です。');
  const result=createRevision();result.selected=saved.selected;result.resolution=saved.resolution;
  for(const [id,task] of Object.entries(revisionCases)){if(typeof saved.checked[id]!=='boolean'||!saved.choices[id])throw new RangeError('途中記録が不正です。');for(const f of task.fields){const choice=saved.choices[id][f.id];if(!['','conflict',f.base,f.ours,f.theirs].includes(choice))throw new RangeError('途中記録が不正です。');result.choices[id][f.id]=choice;}result.checked[id]=saved.checked[id];}return result;
}
export function revisionComplete(state){return Object.keys(revisionCases).every(id=>state.checked[id]&&revisionCorrect(id,state));}
