export const agentStylesLevel={id:'workshop-agent-styles',number:'688',kind:'agent-styles',name:'三人の道案内人形',tag:'反射・目標・効用・期待費用',title:'案内人形の考え方を比べよう',story:'三人の案内人形が薬草を届けます。近道と回り道のある３つの状況で、それぞれの判断と結果を比べましょう。'};
export const agentStyleScenes={clear:{name:'近道が開いていて安全',blocked:false,risk:0},blocked:{name:'近道の橋が閉じている',blocked:true,risk:0},danger:{name:'近道の橋で荷物が傷む恐れ',blocked:false,risk:.5}};
export const agentStylePolicies={reflex:'印に反応する人形',goal:'最短の到達路を探す人形',utility:'期待費用を比べる人形'};
export function agentStyleRun(scene,policy){
 if(!Object.hasOwn(agentStyleScenes,scene)||!Object.hasOwn(agentStylePolicies,policy))throw new RangeError('場面か人形が不正です。');
 const c=agentStyleScenes[scene],routes=[{id:'short',open:!c.blocked,steps:1,cost:1+8*c.risk},{id:'safe',open:true,steps:3,cost:3}];
 const route=policy==='reflex'?routes[0]:routes.filter(x=>x.open).sort((a,b)=>policy==='goal'?a.steps-b.steps:a.cost-b.cost)[0];
 return {route:route.id,arrives:route.open,steps:route.open?route.steps:null,expectedCost:route.open?route.cost:null};
}
export function createAgentStyles(){return {scene:'clear',policy:'reflex',seen:[],report:null,answer:null,checked:false,history:[]};}
export function agentStylesAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=150)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,seen:[...s.seen],history:[...s.history],checked:false};let message='';
 if(action.startsWith('scene:')&&Object.hasOwn(agentStyleScenes,action.slice(6))){n.scene=action.slice(6);n.report=null;message='道の状況を選びました。';}
 else if(action.startsWith('policy:')&&Object.hasOwn(agentStylePolicies,action.slice(7))){n.policy=action.slice(7);n.report=null;message='案内人形を選びました。';}
 else if(action==='run'){
  const outcome=agentStyleRun(s.scene,s.policy),key=`${s.scene}:${s.policy}`;n.report={scene:s.scene,policy:s.policy,...outcome};if(!n.seen.includes(key))n.seen.push(key);
  message=outcome.arrives?'選んだ道と、この模型での期待費用を記録しました。':'橋が閉じているため、この道では到着できません。';
 }
 else if(['answer:context','answer:reflex','answer:goal'].includes(action)){n.answer=action.slice(7);message='振り返りを選びました。';}
 else if(action==='check'){n.checked=true;message='９つの試行と答えを確認しました。';}
 else return {ok:false,message:'道案内の操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreAgentStyles(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>150)throw new RangeError('途中記録が不正です。');let s=createAgentStyles();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=agentStylesAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function agentStylesComplete(s){return Object.keys(agentStyleScenes).every(c=>Object.keys(agentStylePolicies).every(p=>s.seen.includes(`${c}:${p}`)))&&s.answer==='context'&&s.checked;}
