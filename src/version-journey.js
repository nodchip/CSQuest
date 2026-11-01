export const versionJourneyLevel={id:'guild-version-journey',number:'655',kind:'version-journey',name:'分かれた版と祭りの公開',tag:'集中型・分散型の版管理とリリース',title:'切れた通信を越えて版を合わせよう',story:'祭りの案内板を二人で直します。通信が切れている間の記録を比べ、戻った後に変更を合わせ、公開する版を選びましょう。'};
export const versionModes=['central','distributed'];
export function createVersionRun(mode){if(!versionModes.includes(mode))throw new RangeError('方式が不正です。');return {mode,online:true,edited:false,remote:false,offlineAttempt:false,localCommit:false,rejected:false,fetched:false,conflict:false,resolution:null,mergeCommit:false,done:false,history:[]};}
export function versionAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=64||s.done)return {ok:false,message:'これ以上進めません。必要ならこの方式を最初からやり直してください。'};
 const n={...s,history:[...s.history]};let message='';
 if(action==='offline'&&s.online&&!s.edited){n.online=false;message='あなたの通信が切れました。仲間は共有先に接続したままです。';}
 else if(action==='edit'&&!s.online&&!s.edited){n.edited=true;message='手元の案内を東から北に変えました。';}
 else if(action==='remote'&&!s.online&&s.edited&&!s.remote){n.remote=true;message='仲間が共有先の案内を南に更新しました。';}
 else if(action==='commit'&&!s.online&&s.edited&&s.remote&&!s.offlineAttempt){n.offlineAttempt=true;if(s.mode==='distributed'){n.localCommit=true;message='手元のリポジトリに北の変更を記録しました。共有先にはまだ届いていません。';}else message='この集中型の模型では共有先につながらず、版として記録できません。手元の編集は残ります。';}
 else if(action==='online'&&!s.online&&s.offlineAttempt){n.online=true;message='通信が戻りました。';}
 else if(action==='commit'&&s.online&&s.mode==='central'&&s.remote&&!s.fetched&&!s.rejected){n.rejected=true;message='共有先が先に変わっていたため記録できません。更新を取り込みましょう。';}
 else if(action==='publish'&&s.online&&s.mode==='distributed'&&s.localCommit&&!s.fetched&&!s.rejected){n.rejected=true;message='共有先の先行変更を含まないため、送信は拒否されました。';}
 else if(action==='fetch'&&s.online&&s.rejected&&!s.fetched){n.fetched=true;if(s.mode==='central'){n.conflict=true;message='更新で同じ項目の競合が見つかりました。';}else message='共有先の版を取得しました。手元の版への統合はまだです。';}
 else if(action==='merge'&&s.mode==='distributed'&&s.fetched&&!s.conflict&&!s.mergeCommit){n.conflict=true;message='統合すると同じ項目の競合が見つかりました。';}
 else if((action==='resolve:north'||action==='resolve:south')&&s.conflict){n.resolution=action.slice(8);message='最終案を選びました。内容を確認して記録しましょう。';}
 else if(action==='commit'&&s.online&&s.mode==='central'&&s.conflict&&s.resolution){n.conflict=false;n.done=true;message='解決した案を共有先に記録しました。';}
 else if(action==='commit'&&s.online&&s.mode==='distributed'&&s.conflict&&s.resolution&&!s.mergeCommit){n.conflict=false;n.mergeCommit=true;message='解決した統合版を手元に記録しました。共有先にはまだ送っていません。';}
 else if(action==='publish'&&s.online&&s.mode==='distributed'&&s.mergeCommit){n.done=true;message='統合版を共有先へ送りました。';}
 else return {ok:false,message:'その操作の前に、通信・手元・共有先の状態を確かめましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreVersionRun(mode,saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>64)throw new RangeError('途中記録が不正です。');let s=createVersionRun(mode);for(const a of saved.history){const r=versionAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function versionRelease(choice){if(choice==='tag')return {revision:'R1',tested:true};if(choice==='tip')return {revision:'R2',tested:false};throw new RangeError('版の選択が不正です。');}
export function createVersionJourney(){return {selected:'central',runs:{central:createVersionRun('central'),distributed:createVersionRun('distributed')},release:'tag',built:[],answer:null,tagMeaning:null,checked:false};}
export function versionJourneyComplete(s){return versionModes.every(m=>s.runs[m].done)&&['tag','tip'].every(k=>s.built.includes(k))&&s.answer==='tag'&&s.tagMeaning==='reference'&&s.checked;}
export function restoreVersionJourney(s){if(!s||!versionModes.includes(s.selected)||!s.runs||!['tag','tip'].includes(s.release)||!Array.isArray(s.built)||new Set(s.built).size!==s.built.length||s.built.some(k=>!['tag','tip'].includes(k))||![null,'tag','tip','either'].includes(s.answer)||![null,'reference','guarantee','latest'].includes(s.tagMeaning)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,runs:{central:restoreVersionRun('central',s.runs.central),distributed:restoreVersionRun('distributed',s.runs.distributed)},built:[...s.built]};}
