export const historyWebLevel={id:'archive-history-web-journey',number:'1306',kind:'history-web-journey',name:'二つの時代の道しるべ',tag:'Web の歴史・情報共有',title:'記録への道を比べよう',story:'鑑定士が遠い塔にある研究の記録を探しています。古い書庫と、リンクを使う新しい記録網の両方を巡り、探し方の違いを確かめましょう。'};
export const webJourneyPlaces={start:'ギルド',catalog:'案内所',record:'塔の記録'};
export function historyWebReplay(history){
 if(!Array.isArray(history)||history.length>30)throw new RangeError('旅の記録が不正です。');
 const s={mode:null,place:'start',done:[],offline:false,won:false,message:'まず旅の方法を選びましょう。'};
 for(const action of history){
  if(typeof action!=='string'||s.won)throw new RangeError('旅の操作が不正です。');
  if(action==='mode:paper'||action==='mode:web'){if(s.mode!==null)throw new RangeError('先に今の旅を終えるか、出発地に戻りましょう。');s.mode=action.slice(5);if(s.done.includes(s.mode))throw new RangeError('その旅は完了しました。もう一方を試しましょう。');s.place='start';s.offline=false;s.message=s.mode==='paper'?'紙の目録を探しに出発しましょう。':'リンクをたどって記録を探しましょう。';}
  else if(action==='restart'&&s.mode!==null){s.mode=null;s.place='start';s.offline=false;s.message='出発地に戻りました。済んだ旅の記録は残っています。';}
  else if(action==='paper:catalog'&&s.mode==='paper'&&s.place==='start'){s.place='catalog';s.message='案内所の紙の目録に、塔の記録の所在が書かれています。';}
  else if(action==='paper:record'&&s.mode==='paper'&&s.place==='catalog'){s.place='record';s.message='目録を頼りに塔へ歩き、記録を見つけました。';}
  else if(action==='web:catalog'&&s.mode==='web'&&s.place==='start'){s.place='catalog';s.message='ギルドのページから案内ページを開きました。';}
  else if(action==='web:record'&&s.mode==='web'&&s.place==='catalog'){s.place='record';s.message='案内のリンクから、塔のサーバーにある記録を開きました。';}
  else if(action==='web:offline'&&s.mode==='web'&&s.place==='record'){s.offline=true;s.message='この模型では通信を切ると塔の記録を取得できません。保存済みの複製があれば別です。';}
  else if(action==='collect'&&s.mode!==null&&s.place==='record'){if(s.mode==='web'&&!s.offline)throw new RangeError('記録を取る前に、通信を切るとどうなるか試しましょう。');if(!s.done.includes(s.mode))s.done.push(s.mode);s.mode=null;s.place='start';s.offline=false;s.message='記録を持ち帰りました。もう一つの方法も試しましょう。';}
  else if(action==='compare:incorrect')throw new RangeError('Web が生まれる前からインターネットはあり、リンク先にも通信や情報の確認が必要です。');
  else if(action==='compare:correct'){if(s.done.length!==2)throw new RangeError('先に両方の方法で記録を持ち帰りましょう。');s.won=true;s.message='二つの探し方を比べました。';}
  else throw new RangeError('現在地と旅の方法を確かめましょう。');
 }
 return s;
}
export function historyWebCreate(){return {history:[]};}
export function historyWebAct(q,action){if(action==='web:offline'&&historyWebReplay(q.history).offline)return historyWebReplay(q.history);const history=[...q.history,action],s=historyWebReplay(history);if(action==='restart'){const start=q.history.findLastIndex(a=>a==='mode:paper'||a==='mode:web');q.history=q.history.slice(0,start);}else q.history=history;return s;}
export function historyWebRestore(q){if(!q)throw new RangeError('途中記録が不正です。');historyWebReplay(q.history);return {history:[...q.history]};}
