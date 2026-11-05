// 一つのセル。頂点は左上、右上、右下、左下。値は -1 または +1。
export const contourCorners = ['左上', '右上', '右下', '左下'];
export const contourEdges = ['上', '右', '下', '左'];
const endpoints = [[0, 1], [1, 2], [2, 3], [3, 0]];

export function contourCrossings(mask) {
  if (!Number.isInteger(mask) || mask < 0 || mask > 15) throw new RangeError('頂点の状態が不正です。');
  return endpoints.flatMap(([a, b], edge) => Boolean(mask & (1 << a)) !== Boolean(mask & (1 << b)) ? [edge] : []);
}

export function contourCreate() {
  return {mask: 1, selected: [], checked: [], feedback: false};
}

export function contourSetMask(state, mask) {
  contourCrossings(mask);
  state.mask = mask;
  state.selected = [];
  state.feedback = false;
}

export function contourToggleEdge(state, edge) {
  if (!Number.isInteger(edge) || edge < 0 || edge > 3) throw new RangeError('辺が不正です。');
  state.selected = state.selected.includes(edge) ? state.selected.filter(i => i !== edge) : [...state.selected, edge];
  state.feedback = false;
}

export function contourCheck(state) {
  const expected = contourCrossings(state.mask);
  state.feedback = true;
  const correct = state.selected.length === expected.length && expected.every(edge => state.selected.includes(edge));
  if (correct && !state.checked.includes(state.mask)) state.checked.push(state.mask);
  return correct;
}

export function contourCorrect(state) {
  const expected = contourCrossings(state.mask);
  return state.feedback && state.selected.length === expected.length && expected.every(edge => state.selected.includes(edge));
}

export function contourRestore(saved) {
  if (!saved || !Array.isArray(saved.selected) || !Array.isArray(saved.checked) || typeof saved.feedback !== 'boolean') throw new RangeError('境界の記録が不正です。');
  contourCrossings(saved.mask);
  const valid = (array, max) => new Set(array).size === array.length && array.every(n => Number.isInteger(n) && n >= 0 && n <= max);
  if (!valid(saved.selected, 3) || !valid(saved.checked, 15)) throw new RangeError('境界の記録が不正です。');
  return {mask:saved.mask, selected:[...saved.selected], checked:[...saved.checked], feedback:saved.feedback};
}
