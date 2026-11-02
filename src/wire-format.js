export const wireLevel = { id:'workshop-wire-format', number:'831', kind:'wire-format', name:'二つの工房をつなぐ巻物', tag:'言語間のデータ表現', title:'違う並べ方を共通の約束に', story:'小さい位から記す工房と、大きい位から読む工房が、薬草の数を届け合います。２枚の札に分ける約束を決め、どんな数が届くか確かめましょう。' };
export const wireValues = [0x1234, 0x02ff];
export const wireModes = ['native', 'agreed'];

// The sender's native order is little-endian. The receiver interprets both
// fields as a big-endian unsigned 16-bit integer; the agreed wire format is BE.
export function wireResult(value, mode) {
  if (!wireValues.includes(value) || !wireModes.includes(mode)) throw new RangeError('この試行はありません。');
  const high = value >>> 8, low = value & 255;
  const bytes = mode === 'native' ? [low, high] : [high, low];
  return { bytes, received: bytes[0] * 256 + bytes[1] };
}
export function wireCreate() { return { value:wireValues[0], mode:'native', trials:{}, answer:null }; }
export function wireRecord(q, bytes, received) {
  const expected = wireResult(q.value, q.mode);
  if (!Array.isArray(bytes) || bytes.length !== 2 || bytes.some((x,i)=>x !== expected.bytes[i])) throw new RangeError('送り手の並べ方と、２枚の札の順を確かめましょう。');
  if (received !== expected.received) throw new RangeError('受け手は最初の札を大きい位として読みます。');
  q.trials[`${q.mode}:${q.value}`] = true;
}
export function wireComplete(q) { return wireModes.every(m => wireValues.every(v => q.trials[`${m}:${v}`] === true)) && q.answer === 'agreed'; }
export function wireRestore(data) {
  if (!data || !wireValues.includes(data.value) || !wireModes.includes(data.mode) || !data.trials || typeof data.trials !== 'object' || Array.isArray(data.trials) || ![null,'agreed','same','language'].includes(data.answer)) throw new RangeError('記録が不正です。');
  const q=wireCreate(); q.value=data.value; q.mode=data.mode; q.answer=data.answer;
  for (const [key,val] of Object.entries(data.trials)) {
    if (!wireModes.some(m => wireValues.some(v => key === `${m}:${v}`)) || val !== true) throw new RangeError('記録が不正です。');
    q.trials[key]=true;
  }
  return q;
}
