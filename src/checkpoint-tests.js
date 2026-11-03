export const commitGateLevel={id:'guild-checkpoint-tests',number:'1051',kind:'checkpoint-tests',name:'二つの検査門',tag:'共有前後の試験',title:'祭りの灯を安全に届ける',story:'工房で直した灯を仲間と共有します。手元の試験と共有後の統合試験を使い分け、検査記録を版と結びつけましょう。'};
export function commitGateCreate(){return {version:'A',local:null,committed:null,shared:null,ci:null,seen:[],cost:0,answer:null,history:[]};}
export function commitGateAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=64)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,seen:[...s.seen],history:[...s.history]};let message='';
 const mark=x=>{if(!n.seen.includes(x))n.seen.push(x);};
 if(action==='local'){
  const pass=s.version!=='A';n.local={version:s.version,pass};n.cost+=1;if(!pass)mark('local-fail');
  message=pass?`版 ${s.version} は手元の単体試験に合格しました。`:'版 A の単体試験は失敗しました。数量の計算を修理します。';
 }else if(action==='repair'){
  if(s.version==='A'&&s.local?.version==='A'&&!s.local.pass){n.version='B';n.local=null;message='数量の計算を直して版 B の作業内容にしました。もう一度手元で試しましょう。';}
  else if(s.version==='B'&&s.ci?.version==='B'&&!s.ci.pass){n.version='C';n.local=null;message='仲間の台帳と接続する処理を直して版 C の作業内容にしました。';}
  else return {ok:false,message:'まず該当する試験で失敗を確認しましょう。'};
 }else if(action==='commit'){
  if(s.local?.version!==s.version||!s.local.pass)return {ok:false,message:'この模型では、現在の作業内容が手元の試験に合格してから記録します。'};
  n.committed=s.version;message=`版 ${s.version} を手元に記録しました。まだ仲間には共有していません。`;
 }else if(action==='share'){
  if(s.committed!==s.version)return {ok:false,message:'現在の作業内容を先に手元に記録しましょう。'};
  n.shared=s.committed;message=`版 ${s.shared===s.committed?s.shared:s.committed} を共有しました。共有版に対して統合試験を実行できます。`;
 }else if(action==='ci'){
  if(!s.shared)return {ok:false,message:'共有された版がありません。'};
  const pass=s.shared==='C';n.ci={version:s.shared,pass};n.cost+=3;if(!pass)mark('shared-fail');if(pass)mark('shared-pass');
  message=pass?`共有版 ${s.shared} は統合試験に合格しました。`:`共有版 ${s.shared} は仲間の台帳との統合試験に失敗しました。`;
 }else if(['answer:both','answer:local','answer:shared'].includes(action)){n.answer=action.slice(7);message='振り返りを選びました。';}
 else return {ok:false,message:'操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function commitGateRestore(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>64)throw new RangeError('途中記録が不正です。');let s=commitGateCreate();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=commitGateAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function commitGateDone(s){return ['local-fail','shared-fail','shared-pass'].every(x=>s.seen.includes(x))&&s.version==='C'&&s.shared==='C'&&s.ci?.version==='C'&&s.ci.pass&&s.answer==='both';}
