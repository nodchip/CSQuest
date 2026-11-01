export const deviceBridgeLevel={id:'forge-device-bridge',number:'674',kind:'device-bridge',name:'二つの水晶と共通の依頼',tag:'OS の抽象化と装置ドライバー',title:'違う水晶に同じ灯りを届けよう',story:'工房には違う印で動く二種類の水晶があります。道具が直接操作する場合と、司令室に共通の依頼を出す場合を比べましょう。'};
export const deviceBridgeApps={userRaw:'利用者の道具：A の印で直接操作',trustedRaw:'特権を持つ古い道具：A の印で直接操作',portable:'利用者の道具：共通の点灯を依頼'};
export function deviceBridgeRun(app,device,allowed,driverB){
 if(!Object.hasOwn(deviceBridgeApps,app)||!['A','B'].includes(device)||typeof allowed!=='boolean'||typeof driverB!=='boolean')throw new RangeError('装置の条件が不正です。');
 if(app==='userRaw')return {status:'blocked',lit:false,trace:['利用者の直接操作を装置保護が拒否しました。']};
 if(app==='trustedRaw')return device==='A'?{status:'lit',lit:true,trace:['特権を持つ道具が A の印を直接送りました。','水晶 A が点灯しました。']}:{status:'wrong-device',lit:false,trace:['特権を持つ道具が A の印を直接送りました。','水晶 B は別の印が必要なため点灯しません。']};
 if(!allowed)return {status:'denied',lit:false,trace:['司令室が利用者の権限を確認し、依頼を断りました。']};
 if(device==='B'&&!driverB)return {status:'no-driver',lit:false,trace:['司令室の権限確認は通りました。','水晶 B の担当がなく、装置への印を作れません。']};
 return {status:'lit',lit:true,trace:['司令室が権限を確認しました。',`水晶 ${device} の担当が共通の依頼を ${device} の印に変えました。`,`水晶 ${device} が点灯しました。`]};
}
export function createDeviceBridge(){return {app:'userRaw',device:'A',allowed:true,driverB:false,seen:[],report:null,answer:null,checked:false,history:[]};}
export function deviceBridgeAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=100)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,seen:[...s.seen],history:[...s.history],checked:false};let message='';const mark=k=>{if(!n.seen.includes(k))n.seen.push(k);};
 if(action.startsWith('app:')&&Object.hasOwn(deviceBridgeApps,action.slice(4))){n.app=action.slice(4);message='使う道具を選びました。';}
 else if(['device:A','device:B'].includes(action)){n.device=action.slice(-1);message='水晶を選びました。';}
 else if(action==='permission'){n.allowed=!s.allowed;message=`共通の依頼の権限を${n.allowed?'許可':'拒否'}にしました。`;}
 else if(action==='driver'){n.driverB=!s.driverB;message=`水晶 B の担当を${n.driverB?'用意':'取り外し'}ました。`;}
 else if(action==='run'){
  const r=deviceBridgeRun(s.app,s.device,s.allowed,s.driverB);n.report={...r,app:s.app,device:s.device,allowed:s.allowed,driverB:s.driverB};
  if(s.app==='userRaw'&&s.device==='A')mark('user-block');
  if(s.app==='trustedRaw'&&s.device==='A'&&r.lit)mark('raw-A');if(s.app==='trustedRaw'&&s.device==='B'&&!r.lit)mark('raw-B');
  if(s.app==='portable'&&s.device==='A'&&r.lit)mark('os-A');if(s.app==='portable'&&s.device==='B'&&r.status==='no-driver')mark('missing-B');
  if(s.app==='portable'&&s.device==='B'&&r.lit)mark('os-B');if(s.app==='portable'&&s.device==='B'&&r.status==='denied')mark('denied-B');
  message=r.trace.at(-1);
 }
 else if(['answer:layers','answer:magic','answer:bypass'].includes(action)){n.answer=action.slice(7);message='振り返りを選びました。';}
 else if(action==='check'){n.checked=true;message='観察した記録と答えを確認しました。';}
 else return {ok:false,message:'装置と道具を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreDeviceBridge(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>100)throw new RangeError('途中記録が不正です。');let s=createDeviceBridge();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=deviceBridgeAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function deviceBridgeComplete(s){return ['user-block','raw-A','raw-B','os-A','missing-B','os-B','denied-B'].every(k=>s.seen.includes(k))&&s.answer==='layers'&&s.checked;}
