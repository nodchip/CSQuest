export const ioNotificationsLevel={id:'forest-io-notifications',number:'997',kind:'io-notifications',name:'二つの伝令路と通知',tag:'多重化・非同期通信',title:'知らせを受けて読み取ろう',story:'見張り役は二つの伝令路を見守り、届いた知らせを処理します。読み取り可能と操作完了の違いを調べましょう。'};
export const ioCases={multiplex:{name:'二つの伝令路'},stale:{name:'通知後の競合'},completion:{name:'非同期の完了'}};
export function ioInitial(id){if(!Object.hasOwn(ioCases,id))throw new RangeError('不正な場面');return {polls:0,received:[],competed:false,wouldBlock:false,arrived:false,submitted:false,pendingSeen:false,worked:false,time:0,done:false};}
function apply(id,s,action){
 if(id==='multiplex'){
  if(action==='poll'&&s.polls===0){s.polls=1;return 'ＡとＢに読むものがあると通知されました。';}
  if((action==='read-a'||action==='read-b')&&s.polls){const name=action==='read-a'?'Ａ':'Ｂ';if(s.received.includes(name))return null;s.received.push(name);s.done=s.received.length===2;return `${name}の手紙を読みました。`;}
 }else if(id==='stale'){
  if(action==='poll'&&s.polls===0){s.polls=1;return 'Ａに読むものがあると通知されました。';}
  if(action==='compete'&&s.polls===1&&!s.competed){s.competed=true;return '別の読み手がＡの手紙を先に受け取りました。';}
  if(action==='read-a'&&s.competed&&!s.wouldBlock&&!s.arrived){s.wouldBlock=true;return 'Ａは空になっており、非ブロッキング読取りは一時的にできません。';}
  if(action==='advance'&&s.wouldBlock&&!s.arrived){s.arrived=true;return '次の刻にＡへ新しい手紙が届きました。';}
  if(action==='poll'&&s.arrived&&s.polls===1){s.polls=2;return 'Ａが再び読み取り可能と通知されました。';}
  if(action==='read-a'&&s.polls===2&&!s.done){s.received.push('Ａ');s.done=true;return '新しい手紙を読みました。';}
 }else{
  if(action==='submit'&&!s.submitted){s.submitted=true;return '空のＡへの読取りを依頼しました。まだ完了していません。';}
  if(action==='check'&&s.submitted&&!s.pendingSeen&&s.time===0){s.pendingSeen=true;return '操作は保留中です。結果はまだありません。';}
  if(action==='work'&&s.pendingSeen&&!s.worked){s.worked=true;return '待つ間に別の仕事を進めました。';}
  if(action==='advance'&&s.worked&&s.time<2){s.time++;return s.time===1?'Ａに手紙が届きました。この模型ではまだ完了通知を受けていません。':'読取りの完了通知が届きました。';}
  if(action==='collect'&&s.time===2&&!s.done){s.received.push('Ａ');s.done=true;return '完了した読取りの結果を受け取りました。';}
 }
 return null;
}
export function ioReplay(id,history){if(!Array.isArray(history)||history.length>12)throw new RangeError('不正な履歴');const s=ioInitial(id);for(const action of history)if(!apply(id,s,action))throw new RangeError('不正な操作順');return s;}
export function ioStep(id,history,action){const s=ioReplay(id,history),message=apply(id,s,action);return message?{ok:true,history:[...history,action],message}:{ok:false,history:[...history],message:'この場面の状態と操作の順を確かめましょう。依頼では通知や保留の確認を先に行います。'};}
export function ioNotificationsCreate(){return {selected:'multiplex',trials:{multiplex:[],stale:[],completion:[]},reflection:null};}
export function ioNotificationsComplete(s){return s.reflection==='distinguish'&&Object.keys(ioCases).every(id=>ioReplay(id,s.trials[id]).done);}
export function ioNotificationsRestore(saved){if(!saved||!Object.hasOwn(ioCases,saved.selected)||![null,'distinguish','same','guarantee'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const s=ioNotificationsCreate();s.selected=saved.selected;s.reflection=saved.reflection;for(const id of Object.keys(ioCases)){ioReplay(id,saved.trials?.[id]);s.trials[id]=[...saved.trials[id]];}return s;}
