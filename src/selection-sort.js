export const selectionSortLevel={id:'archive-selection-sort',number:'713',kind:'selection-sort',name:'最小の魔石を選ぶ',tag:'選択ソート',title:'書庫の魔石を並べる',story:'鑑定士と一緒に残りの魔石を比べ、最小のものを順に棚へ置きましょう。'};
export const selectionCases={stones:{name:'４つの魔石',items:[{id:'A',value:4},{id:'B',value:2},{id:'C',value:3},{id:'D',value:1}]},ties:{name:'同じ値の魔石',items:[{id:'A',value:2},{id:'B',value:2},{id:'C',value:1}]}};
export function selectionStart(id){if(!Object.hasOwn(selectionCases,id))throw new RangeError('未知の棚です。');return {id,items:selectionCases[id].items.map(x=>({...x})),start:0,min:0,next:1,phase:'compare',comparisons:0,history:[],message:'候補と次の魔石を比べ、小さい方を選びましょう。同じ値なら候補を残します。'};}
export function selectionStep(s,action){
 if(s.phase==='done')throw new RangeError('この棚は整列済みです。');
 if(s.phase==='compare'){
  const expected=s.items[s.min].value<=s.items[s.next].value?s.min:s.next;
  if(action!==expected)return {...s,message:'値を比べ、小さい方を選びます。同じ値なら今の候補を残します。'};
  const next=s.next+1;return {...s,min:expected,next,phase:next===s.items.length?'place':'compare',comparisons:s.comparisons+1,history:[...s.history,action],message:next===s.items.length?'残りを比べ終えました。最小の魔石を先頭に置きましょう。':'次の魔石と候補を比べましょう。'};
 }
 if(action!=='place')return {...s,message:'最小の候補を残りの先頭と入れ替えます。'};
 const items=s.items.map(x=>({...x}));[items[s.start],items[s.min]]=[items[s.min],items[s.start]];const start=s.start+1,done=start===items.length-1;
 return {...s,items,start,min:start,next:start+1,phase:done?'done':'compare',history:[...s.history,action],message:done?'棚が整いました。':'残りの先頭を候補にし、次の魔石と比べましょう。'};
}
export function selectionCreate(){return {selected:'stones',states:{stones:selectionStart('stones'),ties:selectionStart('ties')}};}
export function selectionRestore(saved){if(!saved||!Object.hasOwn(selectionCases,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');const out=selectionCreate();out.selected=saved.selected;for(const id of Object.keys(selectionCases)){const h=saved.history[id];if(!Array.isArray(h)||h.length>12)throw new RangeError('途中記録が不正です。');let s=selectionStart(id);for(const action of h){const next=selectionStep(s,action);if(next.history.length!==s.history.length+1)throw new RangeError('途中記録が不正です。');s=next;}out.states[id]=s;}return out;}
export function selectionComplete(s){return Object.values(s.states).every(x=>x.phase==='done');}
