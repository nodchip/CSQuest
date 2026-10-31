export const hashLevel={id:'hash-archive',number:'19',kind:'hash',name:'魔法の書庫の衝突',tag:'ハッシュ表と衝突',title:'同じ棚に届く手紙',story:'書庫では鍵の番号から棚を決めています。重なった手紙も失わずにしまい、頼まれた手紙を探しましょう。'};
export const insertKeys=[1,4,2];
export const searchKeys=[4,7];
export function bucketFor(key) {
  if(!Number.isInteger(key)||key<0) throw new RangeError('鍵は０以上の整数です。');
  return key%3;
}
export function createHashQuest(){return {buckets:[[],[],[]],inserted:0,search:0,phase:'insert',cursor:0,feedback:''};}
export function hashAction(state,action){
  if(state.phase==='done') throw new RangeError('依頼は完了しています。');
  const buckets=state.buckets.map(bucket=>bucket.slice());
  const next={...state,buckets,feedback:''};
  if(state.phase==='insert'){
    const key=insertKeys[state.inserted], correct=`b${bucketFor(key)}`;
    if(action!==correct) return {...next,feedback:`鍵 ${key} を３で割った余りを確かめましょう。`};
    buckets[bucketFor(key)].push(key);next.inserted++;
    next.feedback=`鍵 ${key} を棚 ${bucketFor(key)} の末尾に入れました。`;
    if(next.inserted===insertKeys.length) next.phase='bucket';
  } else if(state.phase==='bucket'){
    const key=searchKeys[state.search];
    if(action!==`b${bucketFor(key)}`) return {...next,feedback:`探す鍵 ${key} を３で割った余りの棚を選びましょう。`};
    next.phase='compare';next.cursor=0;next.feedback='棚の先頭から鍵を一つずつ比べましょう。';
  } else if(state.phase==='compare'){
    const key=searchKeys[state.search], chain=buckets[bucketFor(key)];
    if(state.cursor<chain.length){
      if(action!==`k${chain[state.cursor]}`) return {...next,feedback:'棚の先頭から順に、まだ調べていない手紙を選びましょう。'};
      if(chain[state.cursor]===key){next.search++;next.phase=next.search===searchKeys.length?'done':'bucket';next.feedback=`鍵 ${key} が見つかりました。`;}
      else {next.cursor++;next.feedback=`鍵 ${chain[state.cursor]} は ${key} と違います。次を調べましょう。`;}
    } else {
      if(action!=='missing') return {...next,feedback:'棚の最後まで調べました。「見つからない」を選びましょう。'};
      next.search++;next.phase=next.search===searchKeys.length?'done':'bucket';next.feedback=`鍵 ${key} は棚にありませんでした。`;
    }
  } else throw new RangeError('未知の状態です。');
  return next;
}
export function restoreHash(actions){
  if(!Array.isArray(actions)||actions.length>10) throw new RangeError('途中記録が不正です。');
  return actions.reduce((state,action)=>{
    if(typeof action!=='string') throw new RangeError('途中記録が不正です。');
    const next=hashAction(state,action);
    if(next.phase===state.phase && next.inserted===state.inserted && next.search===state.search && next.cursor===state.cursor) throw new RangeError('途中記録が不正です。');
    return next;
  },createHashQuest());
}
