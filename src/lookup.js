export const lookupLevel={id:'search-ledger',number:'29',kind:'lookup',name:'書庫の番号探し',tag:'探索と比較回数',title:'並んだ本から番号を探そう',story:'鑑定士の書庫で番号のついた本を探します。一冊ずつ調べる方法と、残りの中央を調べる方法を比べましょう。'};
export const books=[2,4,6,8,10,12,14,16];
export const lookupTargets={present:{name:'番号 14 を探す',value:14},missing:{name:'番号 11 を探す',value:11}};
export const lookupMethods={linear:{name:'順に探す'},binary:{name:'中央から絞る'}};
export function createLookup(target,method){
  if(!Object.hasOwn(lookupTargets,target)||!Object.hasOwn(lookupMethods,method))throw new RangeError('未知の探索です。');
  return {target,method,lo:0,hi:books.length-1,visited:[],status:'playing',message:'調べる本を選びましょう。'};
}
export function inspectBook(state,index){
  if(state.status!=='playing'||!Number.isInteger(index)||index<0||index>=books.length)throw new RangeError('選べない本です。');
  const expected=state.method==='linear'?state.lo:Math.floor((state.lo+state.hi)/2);
  if(index!==expected)return {...state,message:state.method==='linear'?'まだ調べていない本を左から順に選びましょう。':'残っている範囲の中央を選びましょう。偶数冊なら左側の中央です。'};
  const value=books[index],target=lookupTargets[state.target].value,visited=[...state.visited,index];
  if(value===target)return {...state,visited,status:'found',message:`番号 ${value} が見つかりました。`};
  let lo=state.lo,hi=state.hi;
  if(state.method==='linear')lo++;
  else if(value<target)lo=index+1;
  else hi=index-1;
  const status=lo>hi?'missing':'playing';
  return {...state,lo,hi,visited,status,message:status==='missing'?`番号 ${target} は見つかりませんでした。`:state.method==='linear'?`${value} は探している番号と違います。次の本へ進みましょう。`:value<target?`${value} は探す番号より小さいので、ここより右を探します。`:`${value} は探す番号より大きいので、ここより左を探します。`};
}
export function createLookupSet(){return Object.fromEntries(Object.keys(lookupTargets).map(target=>[target,Object.fromEntries(Object.keys(lookupMethods).map(method=>[method,createLookup(target,method)]))]));}
export function restoreLookup(saved){
  if(!saved||!Object.hasOwn(lookupTargets,saved.target)||!Object.hasOwn(lookupMethods,saved.method)||!saved.history)throw new RangeError('途中記録が不正です。');
  const states=createLookupSet();
  for(const target of Object.keys(lookupTargets))for(const method of Object.keys(lookupMethods)){
    const history=saved.history[target]?.[method];if(!Array.isArray(history)||history.length>books.length)throw new RangeError('途中記録が不正です。');
    let state=states[target][method];for(const index of history){const next=inspectBook(state,index);if(next.visited.length!==state.visited.length+1)throw new RangeError('途中記録が不正です。');state=next;}states[target][method]=state;
  }
  return {target:saved.target,method:saved.method,states};
}
