export const deliveryLevel = {
  id:'message-delivery', number:'10', kind:'delivery', name:'風の伝令', tag:'通信と再送',
  title:'届かない手紙',
  story:'嵐の谷を越える伝令の魔法が不安定です。３つに分けた手紙を順番どおりに届けましょう。',
};

export const fragments = ['嵐が', '近づいて', 'います'];

export function createDelivery() {
  return { current:0, phase:'ready', attempts:[0,0,0], received:[], log:[] };
}

// A fixed scenario: first data packet is lost; second packet arrives but its first acknowledgement is lost.
export function transmit(state, action) {
  if (state.phase === 'done') throw new Error('配達は完了しています。');
  if ((state.phase === 'ready' && action !== 'send') || (state.phase === 'waiting' && action !== 'retry')) throw new RangeError('この状態では実行できません。');
  const id=state.current, attempts=state.attempts.slice(), received=state.received.slice(), log=state.log.slice();
  attempts[id]++;
  const dataLost=id===0 && attempts[id]===1;
  const ackLost=id===1 && attempts[id]===1;
  const duplicate=received.includes(id);
  if (!dataLost && !duplicate) received.push(id);
  const acknowledged=!dataLost && !ackLost;
  const next=acknowledged?id+1:id;
  const phase=acknowledged?(next===fragments.length?'done':'ready'):'waiting';
  let detail;
  if (dataLost) detail='手紙は途中で消え、受信者に届かなかった。返事も届かない。';
  else if (ackLost) detail='手紙は届いたが、受け取った返事が途中で消えた。';
  else if (duplicate) detail='同じ番号の手紙が再び届いた。受信者は重複を除き、返事を送り直した。';
  else detail='手紙が届き、受け取った返事も送信者に届いた。';
  log.push({ number:id+1, attempt:attempts[id], detail });
  return {current:next,phase,attempts,received,log};
}
