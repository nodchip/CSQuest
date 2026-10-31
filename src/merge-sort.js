export const mergeLevel={id:'merge-stones',number:'55',kind:'merge',name:'魔石の列を合わせる',tag:'マージソートと安定性',title:'二つの列を一つに',story:'精霊が小さな魔石の列を分けて運んできました。整った列を合わせて、元の順序も守りながら祭壇へ届けましょう。'};
export const mergeCases={first:{name:'赤い祭壇',items:[{id:'A',value:3},{id:'B',value:1},{id:'C',value:3},{id:'D',value:2}]},second:{name:'青い祭壇',items:[{id:'A',value:2},{id:'B',value:1},{id:'C',value:2},{id:'D',value:1}]}};
export function createMerge(id){
  if(!Object.hasOwn(mergeCases,id))throw new RangeError('未知の祭壇です。');
  return {id,runs:mergeCases[id].items.map(item=>[{...item}]),pair:0,left:0,right:0,merged:[],next:[],comparisons:0,history:[],done:false,message:'先頭の魔石を比べ、小さい方を選びましょう。'};
}
export function chooseMerge(state,side){
  if(state.done||!['left','right'].includes(side))throw new RangeError('操作できません。');
  const left=state.runs[state.pair],right=state.runs[state.pair+1],a=left[state.left],b=right[state.right];
  const expected=a.value<=b.value?'left':'right';
  if(side!==expected)return {...state,message:a.value===b.value?'同じ値なら、元の列で先にあった左の魔石を選びます。':'先頭を比べて、値の小さい魔石を選びましょう。'};
  const merged=[...state.merged,side==='left'?a:b];let li=state.left+(side==='left'?1:0),ri=state.right+(side==='right'?1:0);
  let {runs,pair}=state,next=state.next,done=false,message='先頭を比べて、次の魔石を選びましょう。';
  if(li===left.length||ri===right.length){
    merged.push(...left.slice(li),...right.slice(ri));next=[...next,merged];pair+=2;li=0;ri=0;
    if(pair===runs.length){
      if(next.length===1){runs=next;done=true;message='すべての列を合わせました。';}
      else {runs=next;message='この組の列を合わせました。次の大きさの列を合わせましょう。';}
      next=[];pair=0;
    }else message='この組の列を合わせました。次の組へ進みましょう。';
  }
  return {...state,runs,pair,left:li,right:ri,merged:li===0&&ri===0?[]:merged,next,done,comparisons:state.comparisons+1,history:[...state.history,side],message};
}
export function createMergeSet(){return {selected:'first',states:{first:createMerge('first'),second:createMerge('second')}};}
export function restoreMerge(saved){
  if(!saved||!Object.hasOwn(mergeCases,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');
  const result=createMergeSet();result.selected=saved.selected;
  for(const id of Object.keys(mergeCases)){const h=saved.history[id];if(!Array.isArray(h)||h.length>5)throw new RangeError('途中記録が不正です。');let state=createMerge(id);for(const side of h){const next=chooseMerge(state,side);if(next.history.length!==state.history.length+1)throw new RangeError('途中記録が不正です。');state=next;}result.states[id]=state;}return result;
}
export function mergeComplete(value){return Object.values(value.states).every(state=>state.done);}
