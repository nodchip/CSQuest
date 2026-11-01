export const lanternExpeditionLevel={id:'forest-lantern-expedition',number:'649',kind:'lantern-expedition',name:'途切れた灯台への旅',tag:'経路・論理・再送を使う冒険',title:'灯台へ二つの知らせを届けよう',story:'嵐で灯台への知らせが途切れました。限られた灯りで橋を越え、塔から二つの知らせを届けて灯台へ向かいましょう。'};
export const expeditionPlaces={guild:'ギルド',bridge:'橋の門',grove:'木立',tower:'伝令塔',beacon:'灯台'};
export const expeditionEdges=[['guild','bridge',2],['bridge','tower',2],['guild','grove',1],['grove','tower',4],['tower','beacon',1]];
export function createLanternExpedition(){return {place:'guild',energy:5,lamps:[false,false],phase:0,delivered:0,done:false,history:[]};}
export function expeditionMoves(place){if(!Object.hasOwn(expeditionPlaces,place))throw new RangeError('場所が不正です。');return expeditionEdges.flatMap(([a,b,c])=>a===place?[{to:b,cost:c}]:b===place?[{to:a,cost:c}]:[]);}
export function expeditionAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=64)return {ok:false,message:'記録がいっぱいです。旅を最初からやり直してください。'};
 if(s.done)return {ok:false,message:'知らせはすでに届いています。'};
 const next={...s,lamps:[...s.lamps],history:[...s.history]};let message='';
 if(typeof action==='string'&&action.startsWith('move:')){
  const to=action.slice(5),edge=expeditionMoves(s.place).find(e=>e.to===to);if(!edge)return {ok:false,message:'そこへ続く道はありません。'};
  if((s.place==='bridge'&&to==='tower'||s.place==='tower'&&to==='bridge')&&s.lamps[0]===s.lamps[1])return {ok:false,message:'橋の門は二つの灯りの片方だけが点くと開きます。'};
  if(to==='beacon'&&s.phase!==3)return {ok:false,message:'先に塔から二つの知らせを届けましょう。'};
  if(s.energy<edge.cost)return {ok:false,message:'灯りが足りません。道の費用を見直し、必要なら旅をやり直しましょう。'};
  next.place=to;next.energy-=edge.cost;next.done=to==='beacon';message=next.done?'二つの知らせとともに灯台へ到着しました。':`${expeditionPlaces[to]}に着きました。`;
 }else if(action==='lamp:0'||action==='lamp:1'){
  if(s.place!=='bridge')return {ok:false,message:'灯りを操作できるのは橋の門です。'};const i=Number(action.at(-1));next.lamps[i]=!next.lamps[i];message=next.lamps[0]!==next.lamps[1]?'片方だけが点き、橋の門が開きました。':'橋の門は閉じています。';
 }else if(action==='send:0'||action==='send:1'){
  if(s.place!=='tower')return {ok:false,message:'知らせを送れるのは伝令塔です。'};
  if(action==='send:0'&&s.phase===0){next.phase=1;next.delivered=1;message='知らせ０は届きましたが、確認の返事が嵐で失われました。';}
  else if(action==='send:0'&&s.phase===1){next.phase=2;message='知らせ０を再送。受け手は重複を渡さず、確認の返事を再送しました。';}
  else if(action==='send:1'&&s.phase===2){next.phase=3;next.delivered=2;message='知らせ１が届き、確認の返事も戻りました。';}
  else return {ok:false,message:s.phase===1?'確認の返事がないので、知らせ０を送り直しましょう。':s.phase===0?'まず知らせ０を送ります。':s.phase===2?'次は知らせ１を送ります。':'二つとも届いています。'};
 }else return {ok:false,message:'その操作はできません。'};
 next.history.push(action);return {ok:true,state:next,message};
}
export function restoreLanternExpedition(saved){
 if(!saved||!Array.isArray(saved.history)||saved.history.length>64)throw new RangeError('途中記録が不正です。');let s=createLanternExpedition();for(const action of saved.history){const r=expeditionAct(s,action);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;
}
