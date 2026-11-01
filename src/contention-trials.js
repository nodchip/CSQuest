export const contentionCases={
 quietOptimistic:{name:'版確認・競合なし',steps:['ar','aw','br','bw']},
 busyOptimistic:{name:'版確認・競合あり',steps:['ar','br','aw','bw','br','bw']},
 quietLock:{name:'鍵・競合なし',steps:['al','aw','ax','bl','bw','bx']},
 busyLock:{name:'鍵・競合あり',steps:['al','bl','aw','ax','bl','bw','bx']},
 starvation:{name:'版確認・繰り返す競合',steps:['ar','br','bw','aw','ar','br','bw','aw']}
};
export const contentionActions={ar:'アオが読む',br:'アカが読む',aw:'アオが更新',bw:'アカが更新',al:'アオが鍵を取る',bl:'アカが鍵を取る',ax:'アオが鍵を返す',bx:'アカが鍵を返す'};
export function createContention(){return {selected:'quietOptimistic',histories:Object.fromEntries(Object.keys(contentionCases).map(k=>[k,[]])),answers:Object.fromEntries(Object.keys(contentionCases).map(k=>[k,null])),checked:Object.fromEntries(Object.keys(contentionCases).map(k=>[k,false]))};}
export function contentionState(id,history){
 if(!Object.hasOwn(contentionCases,id)||!Array.isArray(history)||history.length>contentionCases[id].steps.length)throw new RangeError('記録が不正です。');
 const locked=id.includes('Lock'),s={value:0,version:0,seen:{a:null,b:null},owner:null,failures:0,waits:0,last:'まだ操作していません。'};
 history.forEach((action,i)=>{
  if(action!==contentionCases[id].steps[i])throw new RangeError('手順が不正です。');
  const actor=action[0],op=action[1],name=actor==='a'?'アオ':'アカ';
  if(op==='r'){s.seen[actor]=s.version;s.last=`${name}が版${s.version}を読みました。`;}
  else if(op==='l'){if(s.owner){s.waits++;s.last=`${name}は鍵を待ちます。`;}else{s.owner=actor;s.last=`${name}が鍵を取りました。`;}}
  else if(op==='x'){if(s.owner!==actor)throw new RangeError('鍵が不正です。');s.owner=null;s.last=`${name}が鍵を返しました。`;}
  else if(op==='w'){
   if(locked&&s.owner!==actor)throw new RangeError('鍵が不正です。');
   if(!locked&&s.seen[actor]!==s.version){s.failures++;s.last=`${name}の古い版は拒否されました。`;}
   else{s.value++;s.version++;s.last=`${name}の更新が確定しました。`;}
  }
 });return s;
}
export function contentionAnswer(id,history){const state=contentionState(id,history);if(history.length!==contentionCases[id].steps.length)return null;return state.failures?'failure':state.waits?'wait':'neither';}
export function contentionComplete(s){return Object.keys(contentionCases).every(id=>{const expected=contentionAnswer(id,s.histories[id]);return expected!==null&&s.checked[id]&&s.answers[id]===expected;});}
export function restoreContention(saved){if(!saved||!Object.hasOwn(contentionCases,saved.selected)||!saved.histories)throw new RangeError('記録が不正です。');const n=createContention();n.selected=saved.selected;for(const id of Object.keys(contentionCases)){contentionState(id,saved.histories[id]);n.histories[id]=[...saved.histories[id]];const answer=saved.answers?.[id]??null,checked=saved.checked?.[id]??false;if(![null,'failure','wait','neither'].includes(answer)||typeof checked!=='boolean'||(checked&&(answer===null||contentionAnswer(id,n.histories[id])===null)))throw new RangeError('予測が不正です。');n.answers[id]=answer;n.checked[id]=checked;}return n;}
