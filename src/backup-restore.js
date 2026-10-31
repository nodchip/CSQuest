export const backupLevel={id:'archive-backup-restore',number:'181',kind:'backup-restore',name:'書庫を取り戻す',tag:'バックアップと復元',title:'どの写しから戻す？',story:'鑑定士が台帳を更新します。障害に備えて写しを作り、問題が起きた後で正しい版を取り戻しましょう。'};
export const backupCases={deleted:{name:'台帳の消失',damage:'missing'},corrupted:{name:'台帳の破損',damage:'corrupt'}};
export const backupLabels={old:'更新前',new:'更新後',corrupt:'破損',missing:'消失'};
export function createBackupTrial(id){if(!Object.hasOwn(backupCases,id))throw new RangeError('試行が不正です。');return {id,live:'old',copies:[],damaged:false,seenOld:false,history:[],message:'まず更新前の台帳の写しを作りましょう。'};}
export function backupStep(s,action){if(!Array.isArray(action))throw new RangeError('操作が不正です。');if(s.history.length>=1000)return {...s,message:'操作の記録が上限に達しました。この試行を最初からやり直しましょう。'};const n={...s,copies:s.copies.slice(),history:s.history.slice()};
 if(action.length===1&&action[0]==='copy'){if(s.live==='missing')return {...s,message:'台帳が消失しているため写せません。'};if(s.copies.length>=4)return {...s,message:'写しの棚がいっぱいです。'};n.copies.push(s.live);n.message=`${backupLabels[s.live]}の写しを作りました。`;}
 else if(action.length===1&&action[0]==='update'){if(s.damaged||s.live!=='old')return {...s,message:'今は更新できません。'};n.live='new';n.message='台帳を更新しました。更新後の写しも作りましょう。';}
 else if(action.length===1&&action[0]==='damage'){if(s.damaged||s.live!=='new')return {...s,message:'更新してから障害を起こしましょう。'};n.live=backupCases[s.id].damage;n.damaged=true;n.message=s.id==='deleted'?'台帳が消失しました。':'台帳が破損しました。';}
 else if(action.length===2&&action[0]==='restore'&&Number.isInteger(action[1])&&action[1]>=0&&action[1]<s.copies.length){if(!s.damaged)return {...s,message:'障害後に写しを選びましょう。'};n.live=s.copies[action[1]];n.seenOld=s.seenOld||n.live==='old';n.message=n.live==='old'?'更新前の内容は戻りましたが、最近の変更は失われています。':n.live==='new'?'更新後の内容が戻りました。':'破損した写しでは正常な内容は戻りません。';}
 else return {...s,message:'今使える操作を選びましょう。'};n.history.push(action);return n;}
export function backupTrialComplete(s){return s.damaged&&s.seenOld&&s.live==='new';}
export function createBackupSet(){return {selected:'deleted',trials:{deleted:createBackupTrial('deleted'),corrupted:createBackupTrial('corrupted')}};}
export function backupComplete(s){return Object.keys(backupCases).every(id=>backupTrialComplete(s.trials[id]));}
export function restoreBackupSet(saved){if(!saved||!Object.hasOwn(backupCases,saved.selected)||!saved.histories)throw new RangeError('途中記録が不正です。');const s=createBackupSet();s.selected=saved.selected;for(const id of Object.keys(backupCases)){const history=saved.histories[id];if(!Array.isArray(history)||history.length>1000)throw new RangeError('履歴が不正です。');for(const action of history){const n=backupStep(s.trials[id],action);if(n.history.length!==s.trials[id].history.length+1)throw new RangeError('履歴が不正です。');s.trials[id]=n;}}return s;}
