export const battleLevel = {
  id: 'guardian', number: '07', kind: 'battle', name: '灯火の守護者', tag: '条件と戦略',
  title: '守護者の試練',
  story: '灯火の門の奥で、古い守護者が道を塞いでいます。胸の二つの灯りが示す隙を見極め、精霊とともに道を開きましょう。',
};

const patterns = [[0,0],[0,1],[1,1],[1,0]];
export const MAX_TURNS = 6;

export function createBattle() {
  return { turn: 0, playerHealth: 2, guardianHealth: 2, status: 'playing', history: [] };
}

export function lightsForTurn(turn) {
  if (!Number.isInteger(turn) || turn < 0) throw new RangeError('ターン番号が不正です。');
  return patterns[turn % patterns.length].slice();
}

export function takeTurn(state, action) {
  if (state.status !== 'playing') throw new Error('戦闘は終了しています。');
  if (action !== 'attack' && action !== 'guard') throw new RangeError('未知の行動です。');
  const [a,b] = lightsForTurn(state.turn);
  const vulnerable = a !== b;
  let playerHealth = state.playerHealth;
  let guardianHealth = state.guardianHealth;
  let message;
  if (action === 'guard') message = '身を守り、守護者の攻撃をしのいだ。';
  else if (vulnerable) { guardianHealth--; message = '片方の灯りだけが点いている！ 精霊の攻撃が届いた。'; }
  else { playerHealth--; message = '灯りが同じ状態だった。攻撃は跳ね返された。'; }
  const turn = state.turn + 1;
  const status = guardianHealth === 0 ? 'won' : playerHealth === 0 || turn >= MAX_TURNS ? 'lost' : 'playing';
  return { turn, playerHealth, guardianHealth, status, history: [...state.history, { turn, a, b, action, message }] };
}
