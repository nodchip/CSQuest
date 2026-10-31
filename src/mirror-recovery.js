export const mirrorLevel={id:'village-mirror-recovery',number:'229',kind:'mirror-recovery',name:'二つの倉庫と封印された記録',tag:'複製と復旧',title:'倉庫の記録を守ろう',story:'薬師の村は在庫の記録を複製し、別に控えも保管しています。二つの異なる困りごとから復旧しましょう。'};
export const mirrorCases={failure:'本倉庫の記録装置が故障',mistake:'在庫を誤って０個に更新'};
export const mirrorActions={event:'困りごとを起こす',inspect:'三つの記録を確かめる',promote:'複製を本倉庫として使う',restore:'封印された控えから戻す'};
export function createMirrorTrial(id){if(!Object.hasOwn(mirrorCases,id))throw new RangeError('場面が不正です。');return {id,primary:4,replica:4,backup:4,stage:'ready',history:[],message:'まず困りごとを起こしましょう。'};}
export function stepMirror(s,action){if(!Object.hasOwn(mirrorCases,s.id)||!Object.hasOwn(mirrorActions,action)||s.history.length>=30)throw new RangeError('操作が不正です。');const n={...s,history:[...s.history,action]};if(action==='event'){if(s.stage!=='ready'){n.message='この場面の困りごとは既に起きています。';return n;}n.stage='affected';if(s.id==='failure'){n.primary=null;n.message='本倉庫の装置が故障し、記録を読めません。';}else{n.primary=0;n.replica=0;n.message='誤った更新が複製にも届きました。';}}
 else if(action==='inspect'){if(s.stage==='affected'){n.stage='inspected';n.message='三つの記録を比べました。どこから復旧できるでしょうか。';}else n.message='困りごとの後に記録を比べましょう。';}
 else if(s.stage!=='inspected')n.message='先に困りごとを起こし、三つの記録を確かめましょう。';
 else if(action==='promote'){if(s.primary!==null)n.message='本倉庫は稼働中です。複製にも誤った値がないか確認しましょう。';else if(s.replica===null)n.message='利用できる複製がありません。';else{n.primary=s.replica;n.replica=null;n.stage='done';n.message='複製を本倉庫に切り替えました。';}}
 else if(s.primary===null)n.message='故障した装置には控えを戻せません。使える装置へ切り替えましょう。';else{n.primary=s.backup;n.replica=s.backup;n.stage='done';n.message='封印された控えから本倉庫に戻し、複製を更新しました。';}return n;}
export function mirrorTrialComplete(s){return s.stage==='done'&&s.primary===4&&(s.id==='failure'?s.replica===null:s.replica===4);}
export function createMirror(){return {selected:'failure',trials:Object.fromEntries(Object.keys(mirrorCases).map(id=>[id,createMirrorTrial(id)]))};}
export function mirrorComplete(s){return Object.keys(mirrorCases).every(id=>mirrorTrialComplete(s.trials[id]));}
export function restoreMirror(saved){if(!saved||!Object.hasOwn(mirrorCases,saved.selected)||!saved.trials)throw new RangeError('途中記録が不正です。');const n=createMirror();n.selected=saved.selected;for(const id of Object.keys(mirrorCases)){const trial=saved.trials[id];if(!trial||!Array.isArray(trial.history)||trial.history.length>30)throw new RangeError('途中記録が不正です。');for(const action of trial.history)n.trials[id]=stepMirror(n.trials[id],action);}return n;}
