export const initiativeLevel={id:'workshop-agent-initiative',number:'689',kind:'agent-initiative',name:'人と人形の橋渡り',tag:'自律性・混合主導・安全確認',title:'橋の状況に合わせて協力しよう',story:'村に薬草を届ける人形は、人の指示、自動判断、共同の相談を切り替えられます。橋の閉鎖にも気を付けて、それぞれの進め方を試しましょう。'};
export const initiativeModes={manual:'人が道を選ぶ',auto:'人形が自動で選ぶ',mixed:'人と人形が提案する'};
export const initiativeRoutes={short:'橋を渡る近道',long:'橋を使わない回り道'};
export function createInitiative(){return {mode:'manual',closed:false,revision:0,plan:null,approved:false,report:null,seen:[],mixedSources:[],staleSeen:false,answer:null,checked:false,history:[]};}
export function initiativeAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=180)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,seen:[...s.seen],mixedSources:[...s.mixedSources],history:[...s.history],checked:false};let message='';
 if(action.startsWith('mode:')&&Object.hasOwn(initiativeModes,action.slice(5))){n.mode=action.slice(5);n.plan=null;n.approved=false;n.report=null;message='進め方を選びました。';}
 else if(action==='scene:open'||action==='scene:closed'){n.closed=action==='scene:closed';n.revision=s.revision+1;n.plan=null;n.approved=false;n.report=null;message='橋の状況を用意しました。';}
 else if(action==='event:close'){
  if(s.closed)return {ok:false,message:'橋はすでに閉じています。'};
  n.closed=true;n.revision=s.revision+1;n.approved=false;n.report=null;message='途中で橋が閉じました。以前の案は古くなり、確認も取り消されます。';
 }
 else if((action==='human:short'||action==='human:long')&&s.mode!=='auto'){
  n.plan={route:action.slice(6),source:'human',revision:s.revision};n.approved=false;n.report=null;message='人が道を提案しました。';
 }
 else if(action==='agent:plan'&&s.mode!=='manual'){
  n.plan={route:s.closed?'long':'short',source:'agent',revision:s.revision};n.approved=false;n.report=null;message=s.closed?'人形が閉鎖を見て回り道を提案しました。':'人形が開いている近道を提案しました。';
 }
 else if(action==='approve'&&s.mode==='mixed'){
  if(!s.plan)return {ok:false,message:'先に人か人形が道を提案しましょう。'};
  n.approved=true;message='人が現在の案を確認しました。出発時にも橋を確認します。';
 }
 else if(action==='depart'){
  if(!s.plan)return {ok:false,message:'先に道を選びましょう。'};
  if(s.mode==='mixed'&&!s.approved)return {ok:false,message:'共同の案を人が確認してから出発しましょう。'};
  const blocked=s.closed&&s.plan.route==='short';n.report={blocked,route:s.plan.route,source:s.plan.source,stale:s.plan.revision!==s.revision};
  if(blocked){if(n.report.stale)n.staleSeen=true;message='出発時の確認で閉じた橋を検出し、通行を止めました。新しい道を選びましょう。';}
  else {const key=`${s.mode}:${s.closed?'closed':'open'}`;if(!n.seen.includes(key))n.seen.push(key);if(s.mode==='mixed'&&!n.mixedSources.includes(s.plan.source))n.mixedSources.push(s.plan.source);message='通れる道で村へ到着しました。';}
 }
 else if(['answer:shared','answer:auto','answer:human'].includes(action)){n.answer=action.slice(7);message='振り返りの答えを選びました。';}
 else if(action==='check'){n.checked=true;message='６条件、途中の閉鎖と答えを確認しました。';}
 else return {ok:false,message:'進め方と操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreInitiative(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>180)throw new RangeError('途中記録が不正です。');let s=createInitiative();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=initiativeAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function initiativeComplete(s){return Object.keys(initiativeModes).every(mode=>['open','closed'].every(c=>s.seen.includes(`${mode}:${c}`)))&&['human','agent'].every(x=>s.mixedSources.includes(x))&&s.staleSeen&&s.answer==='shared'&&s.checked;}
