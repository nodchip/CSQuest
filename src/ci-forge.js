export const ciForgeLevel={id:'guild-ci-forge',number:'656',kind:'ci-forge',name:'工房の連続検査炉',tag:'CI・ビルドと依存関係',title:'試験済みの版を祭りに届けよう',story:'祭りの魔法灯の設計が更新されました。検査炉で版ごとに材料、組立、点灯試験を確かめ、検査済みの灯を届けましょう。'};
const locks={A:'L1',B:'L1',C:'L2'};
const stages=['checkout','install','build','test'];
export function createCiForge(){return {head:'A',cache:'locked',run:null,report:null,observed:[],deployed:null,answer:null,checked:false,history:[]};}
export function ciForgeAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=128)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,observed:[...s.observed],history:[...s.history],run:s.run?{...s.run}:null,checked:false};
 const mark=k=>{if(!n.observed.includes(k))n.observed.push(k);};let message='';
 if(/^head:[ABC]$/.test(action)){n.head=action.slice(-1);message=`共有先の版を ${n.head} にしました。既存の検査記録はそのままです。`;}
 else if(['cache:locked','cache:stale'].includes(action)){n.cache=action.slice(6);message=n.cache==='locked'?'材料表に合う材料を取得します。':'検証を省いて古い材料を復元する設定です。';}
 else if(action==='start'){n.run={revision:s.head,lock:locks[s.head],cache:s.cache,stage:0,installed:null};message=`版 ${s.head} の検査を開始しました。途中で共有先が変わっても、この検査の対象は変わりません。`;}
 else if(action.startsWith('step:')&&s.run&&s.run.stage<4&&action.slice(5)===stages[s.run.stage]){
  const r=n.run,step=action.slice(5);r.stage++;
  if(step==='checkout')message=`版 ${r.revision} と材料表 ${r.lock} を取り出しました。`;
  if(step==='install'){r.installed=r.cache==='locked'?r.lock:'L1';message=`材料 ${r.installed} を用意しました。`;}
  if(step==='build'){
   if(r.installed!==r.lock){n.report={revision:r.revision,lock:r.lock,status:'build-failed'};r.stage=4;if(r.revision==='C')mark('C-stale');message='材料表と復元した材料が合わず、組立に失敗しました。試験には進めません。';}
   else message='組立に成功しました。次は点灯試験です。';
  }
  if(step==='test'){const pass=r.revision!=='B';n.report={revision:r.revision,lock:r.lock,status:pass?'passed':'test-failed'};mark(`${r.revision}-${pass?'pass':'fail'}`);message=pass?'この版は用意された点灯試験に通りました。':'この版は点灯試験に失敗しました。';}
 }
 else if(action==='deploy'){
  if(s.report&&s.report.status==='passed'&&s.report.revision===s.head&&s.report.lock===locks[s.head]){n.deployed=s.head;if(s.head==='C')mark('C-deploy');message=`版 ${s.head} の検査記録を確認して、祭りに届けました。`;}
  else{if(s.report&&s.report.status==='passed'&&s.report.revision!==s.head)mark('stale-report');message='現在の版に対応する成功記録がないため、届けられません。';}
 }
 else if(['answer:scope','answer:perfect','answer:build'].includes(action)){n.answer=action.slice(7);message='振り返りの答えを選びました。';}
 else if(action==='check'){n.checked=true;message='見たことと答えを確認しました。';}
 else return {ok:false,message:'検査の順番と現在の状態を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreCiForge(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>128)throw new RangeError('途中記録が不正です。');let s=createCiForge();for(const action of saved.history){if(typeof action!=='string')throw new RangeError('途中記録が不正です。');const r=ciForgeAct(s,action);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function ciForgeComplete(s){return ['A-pass','stale-report','B-fail','C-stale','C-pass','C-deploy'].every(x=>s.observed.includes(x))&&s.answer==='scope'&&s.checked;}
