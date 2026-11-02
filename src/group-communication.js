export const groupCommunicationLevel={id:'guild-group-communication',number:'964',kind:'group-communication',name:'すれ違う仲間への伝言',tag:'同期・非同期の集団通信',title:'届いた人を確かめる',story:'離れた場所にいる３人の見張りへ、橋の点検を知らせます。水晶の生放送と記録を残す掲示板で、誰に届くか比べましょう。'};
export const groupPeople={a:'アヤ',b:'ベン',c:'コル'};
export const groupOnline=[['a','c'],['b','c']];
export const groupModes={live:'水晶の生放送',board:'記録が残る掲示板'};
export function groupReplay(mode,actions){
 if(!Object.hasOwn(groupModes,mode)||!Array.isArray(actions)||actions.length>3)throw new RangeError('伝言記録が不正です。');
 let slot=0,posted=false;const read=new Set(),sent=new Set();
 for(const action of actions){if(action==='send'){if(sent.has(slot))throw new RangeError('同じ時刻に送信済みです。');sent.add(slot);if(mode==='board')posted=true;for(const id of groupOnline[slot])read.add(id);}else if(action==='advance'){if(slot!==0)throw new RangeError('時刻を進められません。');slot=1;if(mode==='board'&&posted)for(const id of groupOnline[slot])read.add(id);}else throw new RangeError('操作が不正です。');}
 return {slot,posted,read:[...read],sent:[...sent]};
}
export function groupCreate(){return {mode:'live',histories:{live:[],board:[]},reflection:null,access:null};}
export function groupComplete(q){return Object.keys(groupModes).every(mode=>groupReplay(mode,q.histories[mode]).read.length===3)&&q.reflection==='combine'&&q.access==='alternatives';}
export function groupRestore(q){if(!q||!Object.hasOwn(groupModes,q.mode)||!q.histories||![null,'combine','live','board'].includes(q.reflection)||![null,'alternatives','sound','one'].includes(q.access))throw new RangeError('記録が不正です。');const histories={};for(const mode of Object.keys(groupModes)){groupReplay(mode,q.histories[mode]);histories[mode]=[...q.histories[mode]];}return {mode:q.mode,histories,reflection:q.reflection,access:q.access};}
