export const mergeLeft=[{id:'A',key:1},{id:'B',key:1},{id:'C',key:3},{id:'D',key:4}];
export const mergeRight=[{id:'甲',key:1},{id:'乙',key:1},{id:'丙',key:2},{id:'丁',key:4},{id:'戊',key:5}];
export function createMergeJoinLab(){return {left:0,right:0,output:[],history:[]};}
export function mergeJoinDone(s){return s.left>=mergeLeft.length||s.right>=mergeRight.length;}
export function mergeJoinLabAct(s,action){
  if(mergeJoinDone(s))return {ok:false,message:'結合は終わりました。'};
  const l=mergeLeft[s.left],r=mergeRight[s.right],expected=l.key<r.key?'left':l.key>r.key?'right':'match';
  if(action!==expected)return {ok:false,message:'先頭の番号を比べ、小さい側か、同じ番号の組に注目しましょう。'};
  const n={...s,output:[...s.output],history:[...s.history,action]};let message;
  if(action==='left'){n.left++;message='左の番号は右より小さく、残りの右側には一致しないので左を進めました。';}
  else if(action==='right'){n.right++;message='右の番号は左より小さく、残りの左側には一致しないので右を進めました。';}
  else{const left=mergeLeft.filter(x=>x.key===l.key),right=mergeRight.filter(x=>x.key===r.key);for(const a of left)for(const b of right)n.output.push(`${a.id}・${b.id}`);n.left+=left.length;n.right+=right.length;message=`番号 ${l.key} の ${left.length} 行と ${right.length} 行から、${left.length*right.length} 組を作りました。`;}
  return {ok:true,state:n,message};
}
export function restoreMergeJoinLab(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>mergeLeft.length+mergeRight.length)throw new RangeError('結合の記録が不正です。');let s=createMergeJoinLab();for(const action of saved.history){const r=mergeJoinLabAct(s,action);if(!r.ok)throw new RangeError('結合の記録が不正です。');s=r.state;}return s;}
