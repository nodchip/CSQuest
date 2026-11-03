export const raftLevel={id:'forest-raft-log',number:'1006',kind:'raft-log',name:'五つの塔と確かな記録',tag:'分散合意・Raft',title:'五つの塔で記録を守ろう',story:'嵐で五つの塔の通信路が分かれました。代表の塔から記録を届け、確定できる時を調べましょう。'};
export const raftNodes=['A','B','C','D','E'];
export function raftInitial(){return {connected:['A','B'],newCopies:['A'],oldCopies:['A','B','C'],oldChecked:false,oneChecked:false,repaired:false,finalChecked:false,reflection:null};}
function apply(s,a){
 if(a==='old:no'&&!s.oldChecked&&s.newCopies.length===1&&!s.repaired)s.oldChecked=true;
 else if(a==='send:B'&&s.oldChecked&&s.newCopies.length===1&&!s.repaired)s.newCopies.push('B');
 else if(a==='one:no'&&s.newCopies.length===2&&!s.repaired&&!s.oneChecked)s.oneChecked=true;
 else if(a==='repair'&&s.oneChecked&&!s.repaired){s.repaired=true;s.connected=[...raftNodes];}
 else if(/^send:[CDE]$/.test(a)&&s.repaired&&s.newCopies.length===2){const n=a.slice(5);s.newCopies.push(n);if(!s.oldCopies.includes(n))s.oldCopies.push(n);}
 else if(a==='final:both'&&s.newCopies.length===3&&!s.finalChecked)s.finalChecked=true;
 else if(/^reflect:(prefix|old|always)$/.test(a)&&s.finalChecked)s.reflection=a.slice(8);
 else throw new RangeError('操作を確認してください');
 return s;
}
export function raftReplay(history){if(!Array.isArray(history)||history.length>8)throw new RangeError('記録が不正です');const s=raftInitial();for(const action of history){if(typeof action!=='string')throw new RangeError('操作が不正です');apply(s,action);}return s;}
export function raftStep(history,action){const s=raftReplay(history);try{apply(s,action);const next=action.startsWith('reflect:')&&history.at(-1)?.startsWith('reflect:')?[...history.slice(0,-1),action]:[...history,action];return {ok:true,history:next,message:action.startsWith('send:')?'記録を届け、保存の応答を受け取りました。':action==='repair'?'通信路が復旧しました。':action.startsWith('reflect:')?'振り返りを選びました。':'判断しました。次の操作へ進みましょう。'};}catch{return {ok:false,history:[...history],message:action.startsWith('send:')?'通信路、記録の重複、前の判断を確認しましょう。':'多数を数えるだけでよいのは、代表の現在の任期の記録か考えましょう。'};}}
export function raftDone(history){const s=raftReplay(history);return s.finalChecked&&s.reflection==='prefix';}
export function raftRestore(saved){if(!saved||!Array.isArray(saved.history))throw new RangeError('途中記録が不正です');raftReplay(saved.history);return {history:[...saved.history]};}
export function raftCreate(){return {history:[]};}
