export const aspirationCases = {better: 10, equal: 8, lower: 7};
export const aspirationModes = {strict: '例外なし', aspire: '最良値を更新する場合に例外'};
export function createAspiration() { return {mode: 'strict', situation: 'better', seen: [], history: []}; }
export function aspirationAct(state, action) {
  if (!state || !Array.isArray(state.history) || state.history.length >= 100 || typeof action !== 'string') return {ok: false, message: '記録を確認してください。'};
  const next = {...state, seen: [...state.seen], history: [...state.history]};
  let message;
  if (action.startsWith('mode:') && Object.hasOwn(aspirationModes, action.slice(5))) { next.mode = action.slice(5); message = '方式を選びました。'; }
  else if (action.startsWith('case:') && Object.hasOwn(aspirationCases, action.slice(5))) { next.situation = action.slice(5); message = '状況を選びました。'; }
  else if (action === 'choose:override' || action === 'choose:retain') {
    const override = next.mode === 'aspire' && aspirationCases[next.situation] > 8;
    if ((action === 'choose:override') !== override) return {ok: false, message: '方式と、禁止された候補の値を最良値８と比べてみましょう。'};
    const key = `${next.mode}:${next.situation}`;
    if (!next.seen.includes(key)) next.seen.push(key);
    message = override ? '正解。例外で禁止を解除し、見晴らし10の候補へ進みます。' : '正解。禁止を保ち、許される見晴らし６の候補へ進みます。';
  } else return {ok: false, message: '操作を確認してください。'};
  next.history.push(action);
  return {ok: true, state: next, message};
}
export function aspirationComplete(state) { return Object.keys(aspirationModes).every(mode => Object.keys(aspirationCases).every(id => state.seen.includes(`${mode}:${id}`))); }
export function restoreAspiration(saved) {
  if (!saved || !Array.isArray(saved.history) || saved.history.length > 100) throw new RangeError('途中記録が不正です。');
  let state = createAspiration();
  for (const action of saved.history) { const result = aspirationAct(state, action); if (!result.ok) throw new RangeError('途中記録が不正です。'); state = result.state; }
  return state;
}
