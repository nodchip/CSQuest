export const agentStylesLevel={id:'workshop-agent-styles',number:'688',kind:'agent-styles',name:'三人の道案内人形',tag:'反射・目標・効用・期待費用',title:'案内人形の考え方を比べよう',story:'三人の案内人形が薬草を届けます。近道と回り道のある３つの状況で、それぞれの判断と結果を比べましょう。'};
export const agentStyleScenes={clear:{name:'近道が開いていて安全',blocked:false,risk:0},blocked:{name:'近道の橋が閉じている',blocked:true,risk:0},danger:{name:'近道の橋で荷物が傷む恐れ',blocked:false,risk:.5}};
export const agentStylePolicies={reflex:'印に反応する人形',goal:'最短の到達路を探す人形',utility:'期待費用を比べる人形'};
export function agentStyleRun(scene,policy){
 if(!Object.hasOwn(agentStyleScenes,scene)||!Object.hasOwn(agentStylePolicies,policy))throw new RangeError('場面か人形が不正です。');
 const c=agentStyleScenes[scene],routes=[{id:'short',open:!c.blocked,steps:1,cost:1+8*c.risk},{id:'safe',open:true,steps:3,cost:3}];
 const route=policy==='reflex'?routes[0]:routes.filter(x=>x.open).sort((a,b)=>policy==='goal'?a.steps-b.steps:a.cost-b.cost)[0];
 return {route:route.id,arrives:route.open,steps:route.open?route.steps:null,expectedCost:route.open?route.cost:null};
}
export const reasoningScenes={risk:{name:'壊れやすい荷物',shortCost:5,safeCost:3,humanShort:8},clear:{name:'安全な荷物',shortCost:1,safeCost:3,humanShort:2}};
export const reasoningGoals={expected:'期待費用が小さい道',human:'記録の多数派を予測'};
export function reasoningRoute(scene,goal){if(!Object.hasOwn(reasoningScenes,scene)||!Object.hasOwn(reasoningGoals,goal))throw new RangeError('場面か目的が不正です。');const c=reasoningScenes[scene];return goal==='expected'?(c.shortCost<c.safeCost?'short':'safe'):(c.humanShort>5?'short':'safe');}
export function createAgentStyles(){return {scene:'clear',policy:'reflex',seen:[],report:null,answer:null,checked:false,reasonScene:'risk',reasonGoal:'expected',reasonChoice:null,reasonSeen:[],reasonAnswer:null,reasonChecked:false,history:[]};}
export function agentStylesAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=150)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,seen:[...s.seen],reasonSeen:[...s.reasonSeen],history:[...s.history],checked:action.startsWith('reason:')?s.checked:false};let message='';
 if(action.startsWith('scene:')&&Object.hasOwn(agentStyleScenes,action.slice(6))){n.scene=action.slice(6);n.report=null;message='道の状況を選びました。';}
 else if(action.startsWith('policy:')&&Object.hasOwn(agentStylePolicies,action.slice(7))){n.policy=action.slice(7);n.report=null;message='案内人形を選びました。';}
 else if(action==='run'){
  const outcome=agentStyleRun(s.scene,s.policy),key=`${s.scene}:${s.policy}`;n.report={scene:s.scene,policy:s.policy,...outcome};if(!n.seen.includes(key))n.seen.push(key);
  message=outcome.arrives?'選んだ道と、この模型での期待費用を記録しました。':'橋が閉じているため、この道では到着できません。';
 }
 else if(['answer:context','answer:reflex','answer:goal'].includes(action)){n.answer=action.slice(7);message='振り返りを選びました。';}
 else if(action==='check'){n.checked=true;message='９つの試行と答えを確認しました。';}
 else if(action.startsWith('reason:scene:')&&Object.hasOwn(reasoningScenes,action.slice(13))){n.reasonScene=action.slice(13);n.reasonChoice=null;n.reasonChecked=false;message='旅の場面を選びました。';}
 else if(action.startsWith('reason:goal:')&&Object.hasOwn(reasoningGoals,action.slice(12))){n.reasonGoal=action.slice(12);n.reasonChoice=null;n.reasonChecked=false;message='予測の目的を選びました。';}
 else if(['reason:choice:short','reason:choice:safe'].includes(action)){n.reasonChoice=action.slice(14);n.reasonChecked=false;message='道を選びました。';}
 else if(action==='reason:try'){if(s.reasonChoice===null)return {ok:false,message:'先に道を選びましょう。'};const correct=reasoningRoute(s.reasonScene,s.reasonGoal)===s.reasonChoice,key=`${s.reasonScene}:${s.reasonGoal}`;if(correct&&!n.reasonSeen.includes(key))n.reasonSeen.push(key);n.reasonChecked=false;message=correct?'目的に合う道を選びました。':'選んだ目的と、その場面の数を比べましょう。';}
 else if(['reason:answer:goals','reason:answer:identical','reason:answer:all'].includes(action)){n.reasonAnswer=action.slice(14);n.reasonChecked=false;message='二つの目的の違いを選びました。';}
 else if(action==='reason:check'){n.reasonChecked=true;message='４つの比較と答えを確認しました。';}
 else return {ok:false,message:'道案内の操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreAgentStyles(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>150)throw new RangeError('途中記録が不正です。');let s=createAgentStyles();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=agentStylesAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function agentStylesComplete(s){return Object.keys(agentStyleScenes).every(c=>Object.keys(agentStylePolicies).every(p=>s.seen.includes(`${c}:${p}`)))&&s.answer==='context'&&s.checked&&Object.keys(reasoningScenes).every(c=>Object.keys(reasoningGoals).every(g=>s.reasonSeen.includes(`${c}:${g}`)))&&s.reasonAnswer==='goals'&&s.reasonChecked;}
