export const signalLabCases={termDefault:{name:'終了通知・既定の動作',signal:'TERM',mode:'default'},termHandler:{name:'終了通知・処理して戻る',signal:'TERM',mode:'handler'},kill:{name:'捕捉できない終了通知',signal:'KILL',mode:'default'}};
export function createSignalTrial(){return {mode:'default',phase:'ready',attempted:false,handled:false,history:[]};}
export function signalLabStep(id,s,action){
  if(!Object.hasOwn(signalLabCases,id)||s.history.length>=12||s.phase==='done')return {ok:false,message:'この場面の操作は終わっています。'};
  const c=signalLabCases[id],n={...s,history:[...s.history]};let message='';
  if(action==='handler'&&s.phase==='ready'){
    if(c.signal==='KILL'){n.attempted=true;message='SIGKILL の処理を設定することはできません。既定の終了が残ります。';}
    else{n.mode='handler';message='SIGTERM の処理を設定しました。この模型では処理が戻るものとします。';}
  }else if(action==='default'&&s.phase==='ready'){n.mode='default';message='既定の動作を使います。';}
  else if(action==='send'&&s.phase==='ready'){n.phase='pending';message=`SIG${c.signal} を送りました。配送を待っています。`;}
  else if(action==='deliver'&&s.phase==='pending'){n.phase='done';n.handled=c.signal==='TERM'&&s.mode==='handler';message=n.handled?'設定した処理が実行され、戻って仕事を続けます。':'既定の動作で仕事が終了しました。';}
  else return {ok:false,message:'設定してから送り、配送を進めましょう。'};
  n.history.push(action);return {ok:true,state:n,message};
}
export function createSignalLab(){return {selected:'termDefault',trials:Object.fromEntries(Object.keys(signalLabCases).map(id=>[id,createSignalTrial()]))};}
export function signalLabTrialComplete(id,s){const c=signalLabCases[id];return s.phase==='done'&&s.mode===c.mode&&s.handled===(c.mode==='handler')&&(id!=='kill'||s.attempted);}
export function signalLabComplete(s){return Object.keys(signalLabCases).every(id=>signalLabTrialComplete(id,s.trials[id]));}
export function restoreSignalLab(saved){if(!saved||!Object.hasOwn(signalLabCases,saved.selected)||!saved.trials)throw new RangeError('通知の記録が不正です。');const result=createSignalLab();result.selected=saved.selected;for(const id of Object.keys(signalLabCases)){const h=saved.trials[id]?.history;if(!Array.isArray(h)||h.length>12)throw new RangeError('通知の履歴が不正です。');let s=createSignalTrial();for(const action of h){const r=signalLabStep(id,s,action);if(!r.ok)throw new RangeError('通知の履歴が不正です。');s=r.state;}result.trials[id]=s;}return result;}
