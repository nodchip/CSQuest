export const osCompatibilityLevel={id:'archive-os-compatibility',number:'673',kind:'os-compatibility',name:'新旧の窓口をつなぐ工房',tag:'OS の進化・互換性・安全性',title:'古い道具と新しい守りを両立しよう',story:'書庫の基本ソフトに新しい窓口が加わります。古い道具の継続利用と、記録の境界を守る改善を比べましょう。'};
export const osCompatibilityVersions={old:'旧版：古い窓口だけ',new:'新版：新しい窓口だけ',bridge:'新版と旧窓口の仲介'};
export const osCompatibilityApps={oldSafe:{name:'古い道具：２枚を受け取る',api:'legacy',size:2},oldUnsafe:{name:'古い道具：６枚を受け取る',api:'legacy',size:6},newSafe:{name:'新しい道具：２枚を受け取る',api:'modern',size:2}};
export function osCompatibilityRun(version,app){
 if(!Object.hasOwn(osCompatibilityVersions,version)||!Object.hasOwn(osCompatibilityApps,app))throw new RangeError('版または道具が不正です。');
 const spec=osCompatibilityApps[app],legacy=spec.api==='legacy',available=legacy?version!=='new':version!=='old',guarded=!legacy||version==='bridge',cells=['空','空','空','空','守','守'];
 if(!available)return {status:'unsupported',route:'窓口なし',cells};
 if(guarded&&spec.size>4)return {status:'rejected',route:legacy?'旧窓口から検査へ':'新窓口の検査',cells};
 for(let i=0;i<spec.size;i++)cells[i]='札';return {status:spec.size>4?'corrupt':'ok',route:legacy?(version==='bridge'?'旧窓口から検査へ':'旧窓口'):'新窓口の検査',cells};
}
export function createOsCompatibility(){return {version:'old',app:'oldSafe',results:{},answer:null,behavior:null,checked:false,history:[]};}
export function osCompatibilityAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=100)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,results:{...s.results},history:[...s.history],checked:false};let message='';
 if(action.startsWith('version:')&&Object.hasOwn(osCompatibilityVersions,action.slice(8))){n.version=action.slice(8);message='基本ソフトの版を選びました。';}
 else if(action.startsWith('app:')&&Object.hasOwn(osCompatibilityApps,action.slice(4))){n.app=action.slice(4);message='使う道具を選びました。';}
 else if(action==='run'){const result=osCompatibilityRun(s.version,s.app);n.results[`${s.version}:${s.app}`]=result;message={ok:'要求を実行し、記録枠の中に札を入れました。',unsupported:'この版には道具が求める窓口がありません。',rejected:'要求が枠を超えるため、検査で断りました。',corrupt:'枠を超えて書き、隣の守り札が上書きされました。'}[result.status];}
 else if(['answer:bridge','answer:old','answer:new'].includes(action)){n.answer=action.slice(7);message='改善案を選びました。';}
 else if(['behavior:changed','behavior:identical','behavior:all'].includes(action)){n.behavior=action.slice(9);message='古い動作について選びました。';}
 else if(action==='check'){n.checked=true;message='試した記録と答えを確認しました。';}
 else return {ok:false,message:'基本ソフトと道具を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreOsCompatibility(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>100)throw new RangeError('途中記録が不正です。');let s=createOsCompatibility();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=osCompatibilityAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function osCompatibilityComplete(s){return Object.keys(osCompatibilityVersions).every(v=>Object.keys(osCompatibilityApps).every(a=>Object.hasOwn(s.results,`${v}:${a}`)))&&s.answer==='bridge'&&s.behavior==='changed'&&s.checked;}
