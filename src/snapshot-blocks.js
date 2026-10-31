export const snapshotLevel={id:'archive-snapshot-blocks',number:'290',kind:'snapshot-blocks',name:'書庫の時を写す',tag:'スナップショットとコピーオンライト',title:'古い石を残して書き換えよう',story:'鑑定士は二枚の記録石を使っています。以前の状態を写しとして残しながら、新しい内容に書き換えましょう。'};
export const snapshotActions={snap1:'写し１を作る',writeA:'Ａを新しい内容にする',snap2:'写し２を作る',writeB:'Ｂを新しい内容にする',drop1:'写し１を消す',inspect2:'写し２を読む'};
export const snapshotLabels={A0:'Ａの元の石',A1:'Ａの新しい石',B0:'Ｂの元の石',B1:'Ｂの新しい石'};
export function createSnapshot(){return {live:{A:'A0',B:'B0'},snap1:null,snap2:null,flags:{protectedA:false,protectedB:false,deleted:false,inspected:false},history:[],message:'現在の記録はＡ・Ｂとも元の石です。'};}
export function snapshotRefs(s){const refs={};for(const [owner,record] of [['現在',s.live],['写し１',s.snap1],['写し２',s.snap2]])if(record)for(const block of Object.values(record))(refs[block]??=[]).push(owner);return refs;}
export function snapshotStep(s,action){if(!Object.hasOwn(snapshotActions,action))throw new RangeError('操作が不正です');if(s.history.length>=30)return {...s,message:'操作の上限です。最初からやり直しましょう。'};const n={...s,live:{...s.live},flags:{...s.flags},history:[...s.history]};let msg='';
 if(action==='snap1'&&!s.snap1&&!s.flags.deleted){n.snap1={...s.live};msg='写し１は現在と同じ石を参照します。';}
 else if(action==='snap2'&&s.snap1&&!s.snap2){n.snap2={...s.live};msg='写し２は今のＡとＢを参照します。';}
 else if(action==='writeA'&&s.live.A==='A0'){n.live.A='A1';n.flags.protectedA=s.snap1?.A==='A0';msg='Ａの新しい石を用意し、現在の参照を切り替えました。';}
 else if(action==='writeB'&&s.live.B==='B0'){n.live.B='B1';n.flags.protectedB=s.snap2?.B==='B0';msg='Ｂの新しい石を用意し、現在の参照を切り替えました。';}
 else if(action==='drop1'&&s.snap1){n.snap1=null;n.flags.deleted=true;msg='写し１を消しました。ほかに参照されない石だけが不要になります。';}
 else if(action==='inspect2'&&s.snap2){n.flags.inspected=true;msg=`写し２は ${snapshotLabels[s.snap2.A]} と ${snapshotLabels[s.snap2.B]} を参照しています。`;}
 else return {...s,message:'今できる操作を選びましょう。必要なら最初からやり直せます。'};
 if(action!=='inspect2')n.flags.inspected=false;n.history.push(action);n.message=msg;return n;}
export function snapshotComplete(s){return Object.values(s.flags).every(Boolean)&&s.live.A==='A1'&&s.live.B==='B1'&&s.snap2?.A==='A1'&&s.snap2?.B==='B0'&&!s.snap1;}
export function restoreSnapshot(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>30)throw new RangeError('途中記録が不正です');let s=createSnapshot();for(const action of saved.history){const n=snapshotStep(s,action);if(n.history.length!==s.history.length+1)throw new RangeError('履歴が不正です');s=n;}return s;}
