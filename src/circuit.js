export const circuitLevel = {
  id: 'circuit', number: '06', kind: 'circuit', name: 'ふたつの灯火', tag: '論理回路',
  title: '灯火の門',
  story: '遺跡の門は、ふたつの灯火のうち、ちょうど片方だけが点いているときに開きます。欠けた回路を組み立てましょう。',
};

export const gates = {
  AND: { label: '両方（AND）', description: '両方が１のときだけ１を出す。' },
  OR: { label: 'どちらか（OR）', description: '少なくとも一方が１なら１を出す。' },
  NAND: { label: '両方でなければ（NAND）', description: '両方が１のときだけ０を出す。' },
};

export function gate(kind, a, b) {
  if ((a !== 0 && a !== 1) || (b !== 0 && b !== 1)) throw new TypeError('信号は０か１です。');
  if (kind === 'AND') return a & b;
  if (kind === 'OR') return a | b;
  if (kind === 'NAND') return 1 - (a & b);
  throw new RangeError('未知の回路部品です。');
}

export function evaluateCircuit(first, second) {
  return [[0, 0], [0, 1], [1, 0], [1, 1]].map(([a,b]) => {
    const upper = gate(first, a, b);
    const lower = gate(second, a, b);
    const actual = gate('AND', upper, lower);
    return { a, b, upper, lower, actual, expected: a ^ b, correct: actual === (a ^ b) };
  });
}
