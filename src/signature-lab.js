export const signatureFiles={known:{name:'封印された既知の毒札',mark:'月',harmful:true},new:{name:'新しい毒札',mark:'星',harmful:true},safe:{name:'無害な旅券',mark:'月',harmful:false}};
export const signatureVersions={old:['月'],updated:['月','星']};
export function signatureScan(id,version){if(!Object.hasOwn(signatureFiles,id)||!Object.hasOwn(signatureVersions,version))throw new RangeError('試験が不正です。');const file=signatureFiles[id],alert=signatureVersions[version].includes(file.mark);return {alert,harmful:file.harmful,quarantined:alert};}
export function createSignatureLab(){return {version:'old',file:'known',seen:[],result:null,answer:'',checked:false,history:[]};}
export function signatureAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=100)return {ok:false,message:'記録がいっぱいです。最初からやり直してください。'};
 const n={...s,seen:[...s.seen],history:[...s.history],checked:false};let message='';
 if(action.startsWith('version:')&&Object.hasOwn(signatureVersions,action.slice(8))){n.version=action.slice(8);n.result=null;message='照合表を選びました。';}
 else if(action.startsWith('file:')&&Object.hasOwn(signatureFiles,action.slice(5))){n.file=action.slice(5);n.result=null;message='調べる札を選びました。';}
 else if(action==='scan'){n.result=signatureScan(s.file,s.version);const k=`${s.version}:${s.file}`;if(!n.seen.includes(k))n.seen.push(k);message=n.result.alert?'特徴が一致し、札を隔離しました。':'一致する特徴はありませんでした。';}
 else if(['answer:limits','answer:safe'].includes(action)){n.answer=action.slice(7);message='検査の意味を選びました。';}
 else if(action==='check'){n.checked=true;message='調査を確認しました。';}
 else return {ok:false,message:'操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function signatureComplete(s){return Object.keys(signatureVersions).every(v=>Object.keys(signatureFiles).every(f=>s.seen.includes(`${v}:${f}`)))&&s.answer==='limits'&&s.checked;}
export function restoreSignatureLab(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>100)throw new RangeError('途中記録が不正です。');let s=createSignatureLab();for(const action of saved.history){if(typeof action!=='string')throw new RangeError('途中記録が不正です。');const r=signatureAct(s,action);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
