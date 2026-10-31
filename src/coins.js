export const coinsLevel={id:'village-coins',number:'76',kind:'coins',name:'商人と三色の魔石',tag:'動的計画法と貪欲法',title:'少ない魔石で届けよう',story:'村の商人は１・３・４の価値を持つ魔石で支払います。少ない価値から最小枚数を記録し、急いで大きい石を選ぶ方法とも比べましょう。'};
export const denominations=[1,3,4];
export const comparisons=[6,8,10];
export function createCoins(){return {counts:[0],choices:[],selected:[],checked:false,message:'価値１から順番に考えましょう。'};}
export function coinCandidates(state){const n=state.counts.length;return denominations.filter(c=>c<=n).map(coin=>({coin,remainder:n-coin,count:state.counts[n-coin]+1}));}
export function chooseCoin(state,coin){
  if(state.counts.length>10)throw new RangeError('表は完成しています。');
  const candidates=coinCandidates(state),chosen=candidates.find(x=>x.coin===coin);
  if(!chosen)throw new RangeError('その魔石は使えません。');
  const best=Math.min(...candidates.map(x=>x.count));
  if(chosen.count!==best)return {...state,message:`価値 ${chosen.remainder} の最小 ${state.counts[chosen.remainder]} 枚に１枚を足すと ${chosen.count} 枚。もっと少ない候補を探しましょう。`};
  return {...state,counts:[...state.counts,best],choices:[...state.choices,coin],message:`価値 ${state.counts.length} は最小 ${best} 枚です。`};
}
export function greedyCoins(amount){if(!Number.isInteger(amount)||amount<0||amount>10)throw new RangeError('価値が不正です。');const result=[];for(const coin of [...denominations].reverse())while(amount>=coin){result.push(coin);amount-=coin;}return result;}
export function coinDifference(state){return comparisons.filter(n=>greedyCoins(n).length>state.counts[n]);}
export function coinsComplete(state){const expected=coinDifference(state);return state.counts.length===11&&state.checked&&expected.length===state.selected.length&&expected.every(n=>state.selected.includes(n));}
export function restoreCoins(saved){
  if(!saved||!Array.isArray(saved.choices)||saved.choices.length>10||!Array.isArray(saved.selected)||saved.selected.some(n=>!comparisons.includes(n))||new Set(saved.selected).size!==saved.selected.length||typeof saved.checked!=='boolean'||(saved.choices.length<10&&(saved.selected.length||saved.checked)))throw new RangeError('途中記録が不正です。');
  let state=createCoins();for(const coin of saved.choices){const next=chooseCoin(state,coin);if(next.choices.length!==state.choices.length+1)throw new RangeError('途中記録が不正です。');state=next;}
  return {...state,selected:saved.selected.slice(),checked:saved.checked};
}
