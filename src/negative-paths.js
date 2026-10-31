export const negativeLevel={id:'negative-road-costs',number:'138',kind:'negativepaths',name:'返礼のある山道',tag:'負の辺と最短経路',title:'費用の少ない道を探す',story:'山道の一部では通ると返礼を受け取れます。費用が負になる道を含め、目的地までの費用を比べましょう。'};
export const negativeNodes={S:'出発地',A:'峠',B:'泉',G:'目的地'};
export const negativeEdges={sa:{from:'S',to:'A',cost:2},sb:{from:'S',to:'B',cost:5},ba:{from:'B',to:'A',cost:-4},ag:{from:'A',to:'G',cost:2}};
export const negativeModes={greedy:'小さい候補から確定',relax:'すべての道を繰り返し確認'};
export function createNegativeTrial(mode){if(!Object.hasOwn(negativeModes,mode))throw new RangeError('方式が不正です。');return {mode,dist:{S:0,A:null,B:null,G:null},settled:[],seen:[],changed:false,round:1,history:[],done:false,message:'出発地の費用は０です。'};}
export function negativeStep(s,choice){
 if(s.done)return {...s,message:'この方式は終了しています。'};
 if(s.mode==='greedy'){
  if(!Object.hasOwn(negativeNodes,choice))throw new RangeError('地点が不正です。');const candidates=Object.keys(negativeNodes).filter(n=>!s.settled.includes(n)&&s.dist[n]!==null);const least=Math.min(...candidates.map(n=>s.dist[n]));
  if(!candidates.includes(choice)||s.dist[choice]!==least)return {...s,message:'未確定の中から、費用が最も小さい地点を選びましょう。'};
  const n={...s,dist:{...s.dist},settled:[...s.settled,choice],history:[...s.history,choice],message:`${negativeNodes[choice]}を確定しました。`};
  if(choice==='G'){n.done=true;n.message=`目的地を費用 ${n.dist.G} で確定しました。`;return n;}
  for(const e of Object.values(negativeEdges).filter(e=>e.from===choice&&!n.settled.includes(e.to))){const value=n.dist[choice]+e.cost;if(n.dist[e.to]===null||value<n.dist[e.to])n.dist[e.to]=value;}return n;
 }
 if(!Object.hasOwn(negativeEdges,choice))throw new RangeError('道が不正です。');if(s.seen.includes(choice))return {...s,message:'この周ではまだ確認していない道を選びましょう。'};
 const edge=negativeEdges[choice],n={...s,dist:{...s.dist},seen:[...s.seen,choice],history:[...s.history,choice]},from=n.dist[edge.from],value=from===null?null:from+edge.cost,updated=value!==null&&(n.dist[edge.to]===null||value<n.dist[edge.to]);
 if(updated)n.dist[edge.to]=value;n.changed=s.changed||updated;n.message=updated?`${negativeNodes[edge.to]}の候補を ${value} に更新しました。`:'この道では候補は変わりません。';
 if(n.seen.length===Object.keys(negativeEdges).length){if(!n.changed){n.done=true;n.message='１周しても候補が変わらず、確認が終わりました。';}else{n.round++;n.seen=[];n.changed=false;n.message+=' 次の周です。';}}return n;
}
export function createNegative(){return {selected:'greedy',trials:{greedy:createNegativeTrial('greedy'),relax:createNegativeTrial('relax')}};}
export function negativeComplete(s){return Object.keys(negativeModes).every(mode=>s.trials[mode].done);}
export function restoreNegative(saved){if(!saved||!Object.hasOwn(negativeModes,saved.selected)||!saved.histories)throw new RangeError('途中記録が不正です。');const r=createNegative();r.selected=saved.selected;for(const mode of Object.keys(negativeModes)){const h=saved.histories[mode];if(!Array.isArray(h)||h.length>16)throw new RangeError('履歴が不正です。');for(const action of h){const before=r.trials[mode],after=negativeStep(before,action);if(after.history.length!==before.history.length+1)throw new RangeError('履歴が不正です。');r.trials[mode]=after;}}return r;}
