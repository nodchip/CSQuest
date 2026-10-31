export const decompositionLevel={id:'village-decomposition',number:'67',kind:'decomposition',name:'村の台帳を分ける',tag:'関係の分解と結合',title:'同じ名前の村を見分けよう',story:'薬師の台帳には、注文ごとに村の番号と名前が繰り返し書かれています。情報の置き方を変えると、何が起きるでしょう。'};
export const ledgerRows=[{order:'O1',village:'V1',name:'森'},{order:'O2',village:'V1',name:'森'},{order:'O3',village:'V2',name:'森'}];
export const decompositionCases={update:{name:'一行だけ名前を変更',prompt:'V1 の村名が「森」から「新森」に変わりました。O1 の行だけを書き換えると、V1 の名前に食い違いが残るでしょうか？'},village:{name:'村番号で結ぶ',prompt:'注文・村番号と、村番号・村名の二つに分け、村番号で結び直します。何行になり、元の台帳に戻るでしょうか？'},name:{name:'村名で結ぶ',prompt:'注文・村名と、村番号・村名の二つに分け、村名で結び直します。何行になり、元の台帳に戻るでしょうか？'}};
function distinct(rows){return [...new Map(rows.map(row=>[JSON.stringify(row),row])).values()];}
export function changedRows(){return ledgerRows.map(row=>row.order==='O1'?{...row,name:'新森'}:{...row});}
export function splitTables(mode){
  if(!['village','name'].includes(mode))throw new RangeError('未知の分け方です。');
  const left=distinct(ledgerRows.map(row=>({order:row.order,[mode]:row[mode]}))),right=distinct(ledgerRows.map(row=>({village:row.village,name:row.name})));
  return {left,right};
}
export function splitAndJoin(mode){const {left,right}=splitTables(mode);return left.flatMap(a=>right.filter(b=>a[mode]===b[mode]).map(b=>({order:a.order,village:b.village,name:b.name})));}
export function sameLedger(a,b){const encode=rows=>rows.map(row=>JSON.stringify([row.order,row.village,row.name])).sort();return JSON.stringify(encode(a))===JSON.stringify(encode(b));}
export function decompositionResult(id,choice){
  if(!Object.hasOwn(decompositionCases,id))throw new RangeError('未知の試練です。');
  if(id==='update'){const rows=changedRows(),names=new Set(rows.filter(row=>row.village==='V1').map(row=>row.name));return {rows,anomaly:choice.anomaly===(names.size>1?'yes':'no')};}
  const rows=splitAndJoin(id);return {rows,count:choice.count===rows.length,restored:choice.restored===(sameLedger(rows,ledgerRows)?'yes':'no')};
}
export function createDecomposition(){return {selected:'update',choices:{update:{anomaly:'',checked:false},village:{count:null,restored:'',checked:false},name:{count:null,restored:'',checked:false}}};}
export function restoreDecomposition(saved){
  if(!saved||!Object.hasOwn(decompositionCases,saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');const s=createDecomposition();s.selected=saved.selected;
  const u=saved.choices.update;if(!u||!['','yes','no'].includes(u.anomaly)||typeof u.checked!=='boolean')throw new RangeError('途中記録が不正です。');s.choices.update={anomaly:u.anomaly,checked:u.checked};
  for(const id of ['village','name']){const c=saved.choices[id];if(!c||![null,2,3,4,6].includes(c.count)||!['','yes','no'].includes(c.restored)||typeof c.checked!=='boolean')throw new RangeError('途中記録が不正です。');s.choices[id]={count:c.count,restored:c.restored,checked:c.checked};}return s;
}
export function decompositionComplete(s){return Object.keys(decompositionCases).every(id=>{const c=s.choices[id],r=decompositionResult(id,c);return c.checked&&(id==='update'?r.anomaly:r.count&&r.restored);});}
