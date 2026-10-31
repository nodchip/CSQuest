export const sortingLevel = {
  id: 'sorting', number: '05', kind: 'sorting', name: '魔石の並べ替え', tag: '整列',
  title: '乱れた魔石の祭壇',
  story: '祭壇の魔石が乱れ、古い門が閉ざされました。隣り合う魔石を入れ替え、小さい順に並べてください。',
  initial: [4, 2, 3, 1],
};

export function swapAdjacent(values, index) {
  if (!Number.isInteger(index) || index < 0 || index >= values.length - 1) throw new RangeError('隣り合う２つの魔石を選んでください。');
  const next = values.slice();
  [next[index], next[index + 1]] = [next[index + 1], next[index]];
  return next;
}

export function isSorted(values) {
  return values.every((value, index) => index === 0 || values[index - 1] <= value);
}

export function restoreSorting(saved) {
  const initial=sortingLevel.initial;
  if(!saved||!Array.isArray(saved.values)||saved.values.length!==initial.length||
     new Set(saved.values).size!==initial.length||saved.values.some(value=>!initial.includes(value))||
     !Number.isSafeInteger(saved.count)||saved.count<0||saved.count>=Number.MAX_SAFE_INTEGER)throw new RangeError('途中記録が不正です。');
  // Adjacent swaps change the inversion count by one. Extra swaps come in pairs.
  const indices=saved.values.map(value=>initial.indexOf(value));
  let distance=0;
  for(let i=0;i<indices.length;i++)for(let j=i+1;j<indices.length;j++)if(indices[i]>indices[j])distance++;
  if(saved.count<distance||(saved.count-distance)%2!==0)throw new RangeError('途中記録が不正です。');
  return {values:saved.values.slice(),count:saved.count};
}
