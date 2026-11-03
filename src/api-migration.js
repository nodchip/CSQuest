export const migrationLevel={id:'village-api-migration',number:'237',kind:'api-migration',name:'新しい薬草の受取窓口',tag:'段階的な API 移行',title:'受取窓口を引き継ごう',story:'薬草を受け取る窓口の既定数を変えます。利用者が困らないよう、一人ずつ新しい窓口へ案内しましょう。'};
export const migrationClients={screen:'村の画面',desk:'村の受付',traveler:'旅の薬師'};
export const migrationActions={addNew:'新窓口を開く',survey:'利用者を調べる',screen:'村の画面を新窓口へ移す',desk:'村の受付を新窓口へ移す',traveler:'旅の薬師と協力して新窓口へ移す',removeOld:'旧窓口を閉じる',restoreOld:'旧窓口を開き直す',test:'利用者を試す'};
export function createMigration(){return {old:true,new:false,discovered:false,clients:{screen:'old',desk:'old',traveler:'old'},tested:false,interrupted:false,history:[],message:'まず今の窓口と利用者を確認しましょう。'};}
export function migrationResult(s,id){if(!Object.hasOwn(migrationClients,id))throw new RangeError('利用者が不正です。');const source=s.clients[id],available=source==='old'?s.old:s.new;return available?{ok:true,quantity:2}:{ok:false,quantity:null};}
export function stepMigration(s,action){if(s.history.length>=50||!Object.hasOwn(migrationActions,action))throw new RangeError('操作が不正です。');const n={...s,clients:{...s.clients},history:[...s.history,action]};let changed=false;
 if(action==='addNew'){changed=!s.new;n.new=true;n.message='新窓口を開きました。数を省略すると１個です。';}
 else if(action==='survey'){changed=!s.discovered;n.discovered=true;n.message='旅の薬師も旧窓口を利用していると分かりました。';}
 else if(action==='removeOld'){changed=s.old;n.old=false;n.message='旧窓口を閉じました。旧窓口を使う利用者は呼び出せません。';}
 else if(action==='restoreOld'){changed=!s.old;n.old=true;n.message='旧窓口を開き直しました。';}
 else if(action==='test'){n.tested=true;n.message=s.discovered?'把握した３人の結果を試しました。':'把握している２人の結果を試しました。未把握の利用者は表示されません。';}
 else if(action==='traveler'&&!s.discovered)n.message='先に利用者を調べましょう。';
 else {changed=s.clients[action]!=='new';n.clients[action]='new';n.message=`${migrationClients[action]}は新窓口で２個を明示して使います。`;}
 if(changed)n.tested=false;if(Object.keys(migrationClients).some(id=>!migrationResult(n,id).ok))n.interrupted=true;return n;}
export function migrationComplete(s){return s.discovered&&s.new&&!s.old&&Object.values(s.clients).every(x=>x==='new')&&s.tested&&Object.keys(migrationClients).every(id=>migrationResult(s,id).ok&&migrationResult(s,id).quantity===2);}
export function restoreMigration(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>50)throw new RangeError('途中記録が不正です。');let s=createMigration();for(const action of saved.history)s=stepMigration(s,action);return s;}
