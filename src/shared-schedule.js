export const scheduleSyncLevel={id:'guild-shared-schedule',number:'288',kind:'shared-schedule',name:'二人の時刻表',tag:'同期と画面の状態',title:'違う画面からの変更を調整しよう',story:'ギルドと分室の係が同じ伝令の出発時刻を変更します。二つの画面と台帳がいつ一致するか確かめましょう。'};
export const scheduleSyncActions={editA:'本館：８時に変更',editB:'分室：９時に変更',sendA:'本館：変更を送る',sendB:'分室：変更を送る',refreshB:'分室：最新の台帳を確認',retryB:'分室：９時を確認して再送',replyA:'遅れた本館への返事を届ける',refreshA:'本館：最新の台帳を確認'};
export function createScheduleSync(){return {server:{time:'７時',version:1},a:{view:'７時',base:1,status:'同期済み'},b:{view:'７時',base:1,status:'同期済み'},flags:{editedA:false,editedB:false,sentA:false,conflict:false,reviewed:false,retried:false,replied:false,refreshed:false},history:[],message:'両画面は版１の７時を表示しています。'};}
export function scheduleSyncStep(s,action){if(!Object.hasOwn(scheduleSyncActions,action))throw new RangeError('操作が不正です');if(s.history.length>=30)return {...s,message:'操作の上限です。最初からやり直しましょう。'};const n={...s,server:{...s.server},a:{...s.a},b:{...s.b},flags:{...s.flags},history:[...s.history]},f=n.flags;let message='';
 if(action==='editA'&&!f.editedA){n.a.view='８時';n.a.status='未送信';f.editedA=true;message='本館の画面だけを８時に変更しました。';}
 else if(action==='editB'&&!f.editedB){n.b.view='９時';n.b.status='未送信';f.editedB=true;message='分室の画面だけを９時に変更しました。';}
 else if(action==='sendA'&&f.editedA&&f.editedB&&!f.sentA){n.server={time:'８時',version:2};n.a.status='返事待ち';f.sentA=true;message='台帳は版２の８時になりました。本館への返事は遅れています。';}
 else if(action==='sendB'&&f.sentA&&!f.conflict){n.b.status='競合：保存されていない';f.conflict=true;message='分室は古い版１を元に送ったため拒否されました。９時の下書きは残っています。';}
 else if(action==='refreshB'&&f.conflict&&!f.reviewed){n.b.base=2;n.b.status='最新８時を確認、９時は下書き';f.reviewed=true;message='分室は版２の８時を確認しました。９時を上書きするか決められます。';}
 else if(action==='retryB'&&f.reviewed&&!f.retried){n.server={time:'９時',version:3};n.b.base=3;n.b.status='９時を保存済み（版３）';f.retried=true;message='確認して再送し、台帳は版３の９時になりました。';}
 else if(action==='replyA'&&f.retried&&!f.replied){n.a.base=2;n.a.status='８時の受付完了（版２）';f.replied=true;message='版２の成功通知が本館に届きました。この通知だけでは現在の台帳が版２のままとは限りません。';}
 else if(action==='refreshA'&&f.replied&&!f.refreshed){n.a.view='９時';n.a.base=3;n.a.status='最新を確認（版３）';f.refreshed=true;message='本館が最新の版３を読み、９時を表示しました。';}
 else return {...s,message:'この場面では必要な前の操作を済ませてから進みましょう。'};
 n.history.push(action);n.message=message;return n;}
export function scheduleSyncComplete(s){return Object.values(s.flags).every(Boolean);}
export function restoreScheduleSync(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>30)throw new RangeError('途中記録が不正です');let s=createScheduleSync();for(const action of saved.history){const n=scheduleSyncStep(s,action);if(n.history.length!==s.history.length+1)throw new RangeError('履歴が不正です');s=n;}return s;}
