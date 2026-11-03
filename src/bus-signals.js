export const busSignalsLevel={id:'workshop-bus-signals',number:'1021',kind:'bus-signals',name:'三本の魔法路',tag:'アドレス・データ・制御',title:'記憶の塔と札をやりとり',story:'精霊が記憶の塔へ札を読み書きします。行き先、札の内容、合図をそれぞれの魔法路に届けましょう。'};
export const busNames={address:'アドレスの路',data:'データの路',control:'制御の路'};
export const busCases=[
 {id:'read-address',scene:'読取り',message:'CPU → 記憶：読みたい番地 ３',answer:'address',reason:'どの番地を対象にするかを表します。'},
 {id:'read-command',scene:'読取り',message:'CPU → 記憶：「読み取る」という合図',answer:'control',reason:'読取りか書込みかを示す制御の合図です。'},
 {id:'read-value',scene:'読取り',message:'記憶 → CPU：番地３から読み出した札の値 ７',answer:'data',reason:'記憶から返される札の内容です。'},
 {id:'write-address',scene:'書込み',message:'CPU → 記憶：書きたい番地 ５',answer:'address',reason:'書込み先の番地を示します。'},
 {id:'write-value',scene:'書込み',message:'CPU → 記憶：保存する札の値 ９',answer:'data',reason:'番地ではなく、保存する札の内容です。'},
 {id:'write-command',scene:'書込み',message:'CPU → 記憶：「書き込む」という合図',answer:'control',reason:'行う操作を示す制御の合図です。'}
];
export function busCreate(){return {index:0,completed:[],reflection:null};}
export function busAnswer(q,choice){const item=busCases[q.index];if(!item||!Object.hasOwn(busNames,choice))throw new RangeError('選択が不正です。');if(choice!==item.answer)return {ok:false,message:`${busNames[choice]}ではありません。${item.reason} もう一度選びましょう。`};if(!q.completed.includes(item.id))q.completed.push(item.id);return {ok:true,message:`正解。${item.reason}`};}
export function busComplete(q){return busCases.every(item=>q.completed.includes(item.id))&&q.reflection==='roles';}
export function busRestore(q){if(!q||!Number.isInteger(q.index)||q.index<0||q.index>=busCases.length||!Array.isArray(q.completed)||new Set(q.completed).size!==q.completed.length||q.completed.some(id=>!busCases.some(item=>item.id===id))||![null,'roles','same','universal'].includes(q.reflection))throw new RangeError('途中記録が不正です。');return {index:q.index,completed:[...q.completed],reflection:q.reflection};}
