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
