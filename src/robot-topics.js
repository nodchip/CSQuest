export const robotTopicsLevel={id:'forest-robot-topics',number:'690',kind:'robot-topics',name:'人形の知らせと見張り番',tag:'ロボット・トピック・受信待ち',title:'観測の知らせを安全につなごう',story:'自動人形の観測係と移動係が知らせを交換します。話題と型を合わせ、受信待ちと古い観測の扱いを調べましょう。'};
export const robotTopicSeen=['topicMismatch','typeMismatch','matched','drop','depth2','stale','safe'];
export const robotInterfaceTasks={sensor:{name:'観測値を継続して知らせる',expected:'topic'},query:{name:'状態を一度だけ素早く問い合わせる',expected:'service'},navigate:{name:'長い移動を依頼し、途中報告と中止を扱う',expected:'action'}};
export const robotInterfaces={topic:'トピック',service:'サービス',action:'アクション'};
export const robotLanguages={python:{name:'Python',library:'rclpy'},cpp:{name:'C++',library:'rclcpp'}};
export function createRobotTopics(){return {topic:'other',type:'range',depth:1,clock:0,queue:[],last:null,seen:[],report:null,answer:null,checked:false,interfaceTask:'sensor',interfaceChoice:null,interfaceSeen:[],language:'python',library:null,librarySeen:[],interfaceAnswer:null,interfaceChecked:false,history:[]};}
export function robotTopicsAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=180)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,queue:s.queue.map(x=>({...x})),seen:[...s.seen],interfaceSeen:[...s.interfaceSeen],librarySeen:[...s.librarySeen],history:[...s.history],checked:action.startsWith('interface:')?s.checked:false};let message='';
 const mark=k=>{if(!n.seen.includes(k))n.seen.push(k);};
 if(action==='topic:scan'||action==='topic:other'){n.topic=action.slice(6);n.queue=[];n.last=null;n.report=null;message='受信側の話題を変え、待ちと観測を消しました。';}
 else if(action==='type:range'||action==='type:color'){n.type=action.slice(5);n.queue=[];n.last=null;n.report=null;message='受信側の型を変え、待ちと観測を消しました。';}
 else if(action==='depth:1'||action==='depth:2'){n.depth=Number(action.slice(-1));n.queue=[];n.last=null;n.report=null;message='受信待ちの数を変え、待ちと観測を消しました。';}
 else if(action==='publish:near'||action==='publish:clear'){
  const value=action.slice(8);n.report=null;
  if(s.topic!=='scan'){mark('topicMismatch');message='話題が違うため、移動係には届きません。';}
  else if(s.type!=='range'){mark('typeMismatch');message='型が違うため、移動係には届きません。';}
  else {n.queue.push({value,at:s.clock});let dropped=null;if(n.queue.length>s.depth)dropped=n.queue.shift();if(s.depth===1&&dropped?.value==='near'&&value==='clear')mark('drop');message=dropped?'受信待ちが満杯で、一番古い知らせが外れました。':'観測を受信待ちに入れました。';}
 }
 else if(action==='poll'){
  if(!s.queue.length)return {ok:false,message:'受信待ちに知らせがありません。'};
  if(s.depth===2&&s.queue.length===2&&s.queue[0].value==='near'&&s.queue[1].value==='clear')mark('depth2');
  n.last=n.queue.shift();n.report={kind:'poll',value:n.last.value,age:s.clock-n.last.at};if(n.last.value==='near')mark('matched');message='移動係が一番古い知らせを読みました。';
 }
 else if(action==='tick'){n.clock++;n.report=null;message='１刻進みました。観測の鮮度を確認しましょう。';}
 else if(action==='move'){
  const age=s.last?s.clock-s.last.at:null;
  if(!s.last||age>1){if(s.last&&age>1)mark('stale');n.report={kind:'move',result:'stale',age};message='新しい観測がないため、進む指示を出しません。';}
  else if(s.last.value==='near'){n.report={kind:'move',result:'near',age};message='近くに障害物があるため、進む指示を出しません。';}
  else {n.report={kind:'move',result:'move',age};message='新しい「前方が空き」の観測に基づき、進む指示を出しました。';}
 }
 else if(action==='stop'){
  const age=s.last?s.clock-s.last.at:null;n.report={kind:'stop',age};
  if(s.last?.value==='near'&&age<=1&&s.seen.includes('stale'))mark('safe');
  message='移動係が停止を指示しました。';
 }
 else if(['answer:bounded','answer:guarantee','answer:names'].includes(action)){n.answer=action.slice(7);message='振り返りを選びました。';}
 else if(action==='check'){n.checked=true;message='実験と答えを確認しました。';}
 else if(action.startsWith('interface:task:')&&Object.hasOwn(robotInterfaceTasks,action.slice(15))){n.interfaceTask=action.slice(15);n.interfaceChoice=null;n.interfaceChecked=false;message='目的を選びました。';}
 else if(action.startsWith('interface:choice:')&&Object.hasOwn(robotInterfaces,action.slice(17))){n.interfaceChoice=action.slice(17);n.interfaceChecked=false;message='通信方法を選びました。';}
 else if(action==='interface:try'){if(s.interfaceChoice===null)return {ok:false,message:'先に通信方法を選びましょう。'};if(s.interfaceChoice===robotInterfaceTasks[s.interfaceTask].expected){if(!n.interfaceSeen.includes(s.interfaceTask))n.interfaceSeen.push(s.interfaceTask);message='この要件に合う選択です。';}else message='連続する情報か、短い応答か、途中報告と中止が必要な仕事かを比べましょう。';n.interfaceChecked=false;}
 else if(action.startsWith('interface:lang:')&&Object.hasOwn(robotLanguages,action.slice(15))){n.language=action.slice(15);n.library=null;n.interfaceChecked=false;message='使う言語を選びました。';}
 else if(['interface:lib:rclpy','interface:lib:rclcpp'].includes(action)){n.library=action.slice(14);n.interfaceChecked=false;message='クライアントライブラリを選びました。';}
 else if(action==='interface:library'){if(s.library===null)return {ok:false,message:'先にライブラリを選びましょう。'};if(s.library===robotLanguages[s.language].library){if(!n.librarySeen.includes(s.language))n.librarySeen.push(s.language);message='この言語に対応するライブラリです。';}else message='言語とライブラリの組を見直しましょう。';n.interfaceChecked=false;}
 else if(['interface:answer:guidance','interface:answer:guarantee','interface:answer:exclusive'].includes(action)){n.interfaceAnswer=action.slice(17);n.interfaceChecked=false;message='通信方法の選び方を選びました。';}
 else if(action==='interface:check'){n.interfaceChecked=true;message='通信方法と言語の比較を確認しました。';}
 else return {ok:false,message:'知らせの操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreRobotTopics(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>180)throw new RangeError('途中記録が不正です。');let s=createRobotTopics();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=robotTopicsAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function robotTopicsComplete(s){return robotTopicSeen.every(k=>s.seen.includes(k))&&s.answer==='bounded'&&s.checked&&Object.keys(robotInterfaceTasks).every(id=>s.interfaceSeen.includes(id))&&Object.keys(robotLanguages).every(id=>s.librarySeen.includes(id))&&s.interfaceAnswer==='guidance'&&s.interfaceChecked;}
