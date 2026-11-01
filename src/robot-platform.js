export const robotPlatformLevel={id:'forest-robot-platform',number:'691',kind:'robot-platform',name:'三つの道と自動人形',tag:'ロボットの機体・センサー・動作器',title:'道に合う人形を組んで届けよう',story:'薬師の村へ、暗い通路、切れた床、低い門を通る３つの荷物があります。人形の移動方法と観測器を選び、前方を確かめながら届けましょう。'};
export const robotPlatformScenes={night:{name:'暗い通路',dark:true,hazard:null},gap:{name:'切れた床',dark:false,hazard:'gap'},tunnel:{name:'低い門',dark:false,hazard:'low'}};
export const robotPlatformDrives={wheel:{name:'車輪型',cost:1},fly:{name:'飛行型',cost:2}};
export const robotPlatformSensors={camera:'光を使う観測器',range:'距離を測る観測器'};
function trial(){return {position:0,energy:8,scan:null,status:'playing'};}
export function createRobotPlatform(){return {scene:'night',drive:'wheel',sensor:'camera',run:trial(),seen:[],solved:[],answer:null,checked:false,history:[]};}
export function robotPlatformAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=220)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,run:{...s.run},seen:[...s.seen],solved:[...s.solved],history:[...s.history],checked:false};let message='';
 const mark=k=>{if(!n.seen.includes(k))n.seen.push(k);};
 if(action.startsWith('scene:')&&Object.hasOwn(robotPlatformScenes,action.slice(6))){n.scene=action.slice(6);n.run=trial();message='別の道を入口から用意しました。';}
 else if(action.startsWith('drive:')&&Object.hasOwn(robotPlatformDrives,action.slice(6))){n.drive=action.slice(6);n.run=trial();message='移動方法を変え、入口からやり直します。';}
 else if(action.startsWith('sensor:')&&Object.hasOwn(robotPlatformSensors,action.slice(7))){n.sensor=action.slice(7);n.run=trial();message='観測器を変え、入口からやり直します。';}
 else if(action==='reset'){n.run=trial();message='同じ構成で入口からやり直します。';}
 else if(action==='scan'&&s.run.status==='playing'){
  const scene=robotPlatformScenes[s.scene],next=s.run.position+1,reading=scene.dark&&s.sensor==='camera'?'unknown':next===2&&scene.hazard?scene.hazard:'clear';
  n.run.scan=reading;if(reading==='unknown')mark('dark');message=reading==='unknown'?'暗くて前方を観測できません。':reading==='gap'?'前方の床が切れています。':reading==='low'?'前方に低い門があります。':'前方はこの模型では通路です。';
 }
 else if(action==='forward'&&s.run.status==='playing'){
  if(!s.run.scan)return {ok:false,message:'先に前方を観測しましょう。'};
  if(s.run.scan==='unknown')return {ok:false,message:'前方が不明なので進めません。観測器を見直しましょう。'};
  if(s.run.scan==='gap'&&s.drive==='wheel'){mark('gap');message='車輪型はこの切れた床を越えられません。';}
  else if(s.run.scan==='low'&&s.drive==='fly'){mark('low');message='飛行型はこの低い門を通れません。';}
  else if(s.run.energy<robotPlatformDrives[s.drive].cost){message='残りの力が足りません。構成を見直しましょう。';}
  else {n.run.position++;n.run.energy-=robotPlatformDrives[s.drive].cost;n.run.scan=null;if(n.run.position===4){n.run.status='arrived';if(!n.solved.includes(s.scene))n.solved.push(s.scene);message='荷物を届けました。';}else message='一歩進みました。もう一度前方を観測しましょう。';}
 }
 else if(['answer:fit','answer:universal','answer:sensor'].includes(action)){n.answer=action.slice(7);message='振り返りを選びました。';}
 else if(action==='check'){n.checked=true;message='３つの道と観察、答えを確認しました。';}
 else return {ok:false,message:'人形と道の操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreRobotPlatform(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>220)throw new RangeError('途中記録が不正です。');let s=createRobotPlatform();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=robotPlatformAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function robotPlatformComplete(s){return Object.keys(robotPlatformScenes).every(k=>s.solved.includes(k))&&['dark','gap','low'].every(k=>s.seen.includes(k))&&s.answer==='fit'&&s.checked;}
