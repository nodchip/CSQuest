export const versionLevel={id:'village-version-choice',number:'236',kind:'version-choice',name:'窓口の版を知らせよう',tag:'バージョン付けと互換性',title:'変更を版の番号で伝えよう',story:'村の窓口を使う人たちに、変更の性質が伝わる版の番号を選びましょう。'};
export const versionCases={fix:{name:'互換性を保つ不具合修正',description:'公開された使い方を変えず、約束に反していた表示の誤りだけを直します。',required:'patch'},add:{name:'互換性を保つ機能追加',description:'旧窓口をそのまま残し、新しい窓口を追加します。',required:'minor'},remove:{name:'旧窓口の削除',description:'公開されていた旧窓口を削除します。旧窓口の利用者は呼び出せません。',required:'major'}};
export const versionKinds={patch:'パッチを１つ進める',minor:'マイナーを１つ進める',major:'メジャーを１つ進める'};
export function nextVersion(kind){if(!Object.hasOwn(versionKinds,kind))throw new RangeError('版の変更が不正です。');const [major,minor,patch]=[1,2,3];return kind==='major'?`${major+1}.0.0`:kind==='minor'?`${major}.${minor+1}.0`:`${major}.${minor}.${patch+1}`;}
export function createVersion(){return Object.fromEntries(Object.keys(versionCases).map(id=>[id,{choice:null,checked:false}]));}
export function versionTrialCorrect(s,id){if(!Object.hasOwn(versionCases,id))throw new RangeError('変更が不正です。');return s.checked&&s.choice===versionCases[id].required;}
export function versionComplete(s){return Object.keys(versionCases).every(id=>versionTrialCorrect(s[id],id));}
export function restoreVersion(saved){if(!saved||!Object.keys(versionCases).every(id=>saved[id]&&(saved[id].choice===null||Object.hasOwn(versionKinds,saved[id].choice))&&typeof saved[id].checked==='boolean'))throw new RangeError('途中記録が不正です。');return Object.fromEntries(Object.keys(versionCases).map(id=>[id,{choice:saved[id].choice,checked:saved[id].checked}]));}
