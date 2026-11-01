export const deputyLevel={id:'castle-deputy-access',number:'671',kind:'deputy-access',name:'受付を通る二つの鍵',tag:'OS の権限と代理処理',title:'依頼者と受付の権限を分けよう',story:'王城の受付は二人の記録を代わりに読みます。本人の鍵と受付の鍵を比べ、他人の記録を守りながら必要な依頼を届けましょう。'};
export const deputyModes={broad:'受付は A・B を読める、依頼者を照合しない',guarded:'受付は A・B を読める、依頼者を照合する',limited:'受付は A のみ読める、依頼者を照合しない'};
export function deputyOutcome(mode,path,caller,target){
 if(!Object.hasOwn(deputyModes,mode)||!['direct','service'].includes(path)||!['A','B'].includes(caller)||!['A','B'].includes(target))throw new RangeError('依頼が不正です。');
 const authorized=caller===target,subject=path==='direct'?caller:'受付',appAllowed=path==='direct'?null:mode==='guarded'?authorized:true,osChecked=appAllowed!==false,osAllowed=!osChecked?null:path==='direct'?authorized:mode==='limited'?target==='A':true,delivered=osChecked&&osAllowed;
 return {authorized,subject,appAllowed,osAllowed,delivered,leak:delivered&&!authorized};
}
export function createDeputyQuest(){return {mode:'broad',caller:'A',target:'A',seen:[],report:null,answer:null,checked:false,history:[]};}
export function deputyAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=100)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,seen:[...s.seen],history:[...s.history],checked:false};let message='';const mark=k=>{if(!n.seen.includes(k))n.seen.push(k);};
 if(action.startsWith('mode:')&&Object.hasOwn(deputyModes,action.slice(5))){n.mode=action.slice(5);message='受付の仕組みを選びました。';}
 else if(['caller:A','caller:B'].includes(action)){n.caller=action.slice(-1);message='依頼する人を選びました。';}
 else if(['target:A','target:B'].includes(action)){n.target=action.slice(-1);message='読みたい記録を選びました。';}
 else if(action==='direct'||action==='service'){
  const r=deputyOutcome(s.mode,action,s.caller,s.target);n.report={...r,path:action,mode:s.mode,caller:s.caller,target:s.target};
  if(action==='direct'&&s.caller==='A'&&s.target==='B'&&!r.delivered)mark('direct-ab');
  if(action==='service'&&s.mode==='broad'&&s.caller==='A'&&s.target==='B'&&r.leak)mark('broad-ab');
  if(action==='service'&&s.mode==='guarded'&&s.caller==='A'&&s.target==='B'&&!r.delivered)mark('guard-ab');
  if(action==='service'&&s.mode==='guarded'&&s.caller===s.target&&r.delivered)mark(`guard-${s.caller}`);
  if(action==='service'&&s.mode==='limited'&&s.caller==='A'&&s.target==='B'&&!r.delivered)mark('limited-ab');
  if(action==='service'&&s.mode==='limited'&&s.caller==='B'&&s.target==='A'&&r.leak)mark('limited-ba');
  if(action==='service'&&s.mode==='limited'&&s.caller==='B'&&s.target==='B'&&!r.delivered)mark('limited-bb');
  message=r.leak?'許可のない人に記録が渡りました。':r.delivered?'許可された記録が渡りました。':r.appAllowed===false?'受付が依頼者と対象を照合して断りました。':'OS が読み取りを断りました。';
 }
 else if(['answer:layers','answer:os-only','answer:limited-only'].includes(action)){n.answer=action.slice(7);message='振り返りを選びました。';}
 else if(action==='check'){n.checked=true;message='記録と答えを確認しました。';}
 else return {ok:false,message:'依頼者と読み方を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreDeputyQuest(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>100)throw new RangeError('途中記録が不正です。');let s=createDeputyQuest();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=deputyAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function deputyComplete(s){return ['direct-ab','broad-ab','guard-ab','guard-A','guard-B','limited-ab','limited-ba','limited-bb'].every(k=>s.seen.includes(k))&&s.answer==='layers'&&s.checked;}
