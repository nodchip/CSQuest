export const historyPerspectivesLevel={id:'guild-history-perspectives',number:'1305',kind:'history-perspectives',name:'消えた名を探す旅',tag:'計算の歴史・史料と視点',title:'展示に残る物語を見直そう',story:'ギルドの展示には、巨大な計算機を設計した二人の名しかありません。資料庫を巡り、機械を動かした人々の記録も探しましょう。'};
export const historySources={
 design:{name:'機械の記録',text:'Computer History Museum の年表は、ENIAC の製作に携わった設計者 Mauchly と Eckert、真空管や配線を紹介しています。機械の設計や構造に焦点が当たります。',url:'https://www.computerhistory.org/timeline/1946/'},
 program:{name:'プログラマーの記録',text:'同館の Jean Bartik の紹介によると、Bartik ら６人は機械の図面から動作を学び、配線とスイッチでプログラムを設定しました。プログラムを作る人々の仕事が見えます。',url:'https://computerhistory.org/events/an-evening-with-jean-jennings-bartik/'}
};
export function historyPerspectivesReplay(history){
 if(!Array.isArray(history)||history.length>20)throw new RangeError('旅の記録が不正です。');
 const s={seen:[],placed:[],won:false,message:'まず資料庫で二つの記録を調べましょう。'};
 for(const action of history){
  if(typeof action!=='string'||s.won)throw new RangeError('旅の操作が不正です。');
  if(action.startsWith('read:')){const key=action.slice(5);if(!Object.hasOwn(historySources,key))throw new RangeError('記録が見つかりません。');if(!s.seen.includes(key))s.seen.push(key);s.message=historySources[key].name+'を調べました。';}
  else if(action.startsWith('place:')){const key=action.slice(6);if(!Object.hasOwn(historySources,key)||!s.seen.includes(key))throw new RangeError('先にその記録を調べましょう。');if(!s.placed.includes(key))s.placed.push(key);s.message=historySources[key].name+'を展示に加えました。';}
  else if(action==='explain:one')throw new RangeError('一つの資料の焦点だけでは、関わった人々の仕事の全体は分かりません。');
  else if(action==='explain:both'){if(s.placed.length!==2)throw new RangeError('二つの記録を調べ、展示に加えてから説明しましょう。');s.won=true;s.message='異なる焦点の資料を組み合わせて展示を完成させました。';}
  else throw new RangeError('今できる操作を選びましょう。');
 }
 return s;
}
export function historyPerspectivesCreate(){return {history:[]};}
export function historyPerspectivesAct(q,action){if(q.history.includes(action))return historyPerspectivesReplay(q.history);const history=[...q.history,action],s=historyPerspectivesReplay(history);q.history=history;return s;}
export function historyPerspectivesRestore(q){if(!q)throw new RangeError('途中記録が不正です。');historyPerspectivesReplay(q.history);return {history:[...q.history]};}
