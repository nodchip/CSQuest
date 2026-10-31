export const mountLevel={id:'archive-mount-overlay',number:'291',kind:'mount-overlay',name:'書庫につながる別の棚',tag:'マウントと名前解決',title:'同じ道の先を比べよう',story:'書庫の「地図」棚に、遠方の棚をつなぎます。同じ道から見える本と、先に開いた本を確かめましょう。'};
export const mountActions={readPath:'「地図／案内」を道から読む',open:'接続前の本を開く',mount:'遠方の棚を接続する',readHandle:'開いた本を読む',unmount:'遠方の棚を外す'};
export function createMount(){return {mounted:false,opened:false,flags:{before:false,mounted:false,during:false,handle:false,unmounted:false,after:false},history:[],message:'最初は本館の棚につながっています。'};}
export function mountStep(s,action){if(!Object.hasOwn(mountActions,action))throw new RangeError('操作が不正です');if(s.history.length>=30)return {...s,message:'操作の上限です。最初からやり直しましょう。'};const n={...s,flags:{...s.flags},history:[...s.history]};let message='';
 if(action==='readPath'){if(s.mounted){n.flags.during=true;message='道からは遠方の「新しい案内」が見えます。';}else{if(s.flags.unmounted)n.flags.after=true;else n.flags.before=true;message='道からは本館の「古い案内」が見えます。';}}
 else if(action==='open'&&!s.mounted&&!s.opened&&!s.flags.mounted){n.opened=true;message='本館の「古い案内」を開きました。';}
 else if(action==='mount'&&!s.mounted&&!s.flags.mounted){n.mounted=true;n.flags.mounted=true;message='遠方の棚を「地図」の場所に接続しました。本館の棚は消えず、道から一時的に隠れます。';}
 else if(action==='readHandle'&&s.opened){if(s.mounted)n.flags.handle=true;message='先に開いた参照から、本館の「古い案内」を読みました。';}
 else if(action==='unmount'&&s.mounted){n.mounted=false;n.flags.unmounted=true;message='遠方の棚を外し、本館の棚が道から再び見えます。';}
 else return {...s,message:'今できる操作を選びましょう。順番を間違えたら最初からやり直せます。'};
 n.history.push(action);n.message=message;return n;}
export function mountComplete(s){return s.opened&&Object.values(s.flags).every(Boolean);}
export function restoreMount(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>30)throw new RangeError('途中記録が不正です');let s=createMount();for(const action of saved.history){const n=mountStep(s,action);if(n.history.length!==s.history.length+1)throw new RangeError('履歴が不正です');s=n;}return s;}
