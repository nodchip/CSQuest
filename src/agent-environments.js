export const agentEnvironmentsLevel={id:'workshop-agent-environments',number:'687',kind:'agent-environments',name:'人形が出会う二つの道',tag:'エージェント・環境の特性',title:'人形から見える世界を調べよう',story:'ギルドの人形は静かな遺跡と霧の橋を渡ります。同じ操作を実験し、環境が人形に何を見せ、どう変わるか調べましょう。'};
export const agentScenes={still:'静かな遺跡',fog:'霧の橋'};
export const agentDimensions={observation:{label:'人形からの観測',options:{full:'完全に観測できる',partial:'一部しか観測できない'}},transition:{label:'同じ状態と行動の結果',options:{deterministic:'決定的',stochastic:'確率的'}},agents:{label:'主体の数',options:{single:'人形だけ',multiple:'他の主体もいる'}},time:{label:'人形が決めている間',options:{static:'環境は変化しない',dynamic:'環境が変化する'}},state:{label:'状態と時間の模型',options:{discrete:'離散',continuous:'連続'}}};
export const agentExpected={still:{observation:'full',transition:'deterministic',agents:'single',time:'static',state:'discrete'},fog:{observation:'partial',transition:'stochastic',agents:'multiple',time:'dynamic',state:'discrete'}};
export function agentEnvironmentTrial(scene,guard,kind){
 if(!Object.hasOwn(agentScenes,scene)||![1,2].includes(guard)||!['calm','gust','wait'].includes(kind))throw new RangeError('環境か試行が不正です。');
 if(scene==='still')return {observation:'位置０、目的地２',beforeGuard:null,afterGuard:null,player:kind==='wait'?0:1};
 return {observation:'位置０、目的地２、番人の位置は見えない',beforeGuard:guard,afterGuard:guard===1?2:1,player:kind==='calm'?1:0};
}
export function createAgentEnvironments(){return {scene:'still',guard:1,logs:{},choices:{still:{},fog:{}},solved:[],report:null,history:[]};}
export function agentEnvironmentsAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=160)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,logs:{...s.logs},choices:{still:{...s.choices.still},fog:{...s.choices.fog}},solved:[...s.solved],history:[...s.history]};let message='';
 if(action.startsWith('scene:')&&Object.hasOwn(agentScenes,action.slice(6))){n.scene=action.slice(6);n.report=null;message='環境を選びました。';}
 else if((action==='guard:1'||action==='guard:2')&&s.scene==='fog'){n.guard=Number(action.slice(-1));n.report=null;message='実験開始時の番人の位置を設定しました。人形には見えません。';}
 else if(['run:calm','run:gust','run:wait'].includes(action)){
  const kind=action.slice(4);if(s.scene==='still'&&kind==='gust')return {ok:false,message:'静かな遺跡では風の分岐はありません。'};
  const key=s.scene==='still'?`still:${kind==='wait'?'wait':'step'}`:`fog:${s.guard}:${kind}`;
  const trial=agentEnvironmentTrial(s.scene,s.guard,kind);n.logs[key]=trial;n.report={key,...trial};message='同じ初期状態から試し、結果を記録しました。';
 }
 else if(action.startsWith('choose:')){
  const [,dimension,choice]=action.split(':');if(!Object.hasOwn(agentDimensions,dimension)||!Object.hasOwn(agentDimensions[dimension].options,choice))return {ok:false,message:'分類の選択を確認しましょう。'};
  n.choices[s.scene][dimension]=choice;n.report=null;message='環境の特性を選びました。';
 }
 else if(action==='check'){
  const required=s.scene==='still'?['still:step','still:wait']:['fog:1:calm','fog:1:gust','fog:2:calm','fog:1:wait'];
  if(!required.every(k=>Object.hasOwn(s.logs,k)))return {ok:false,message:'指定された実験を先に記録しましょう。'};
  const correct=Object.entries(agentExpected[s.scene]).every(([k,v])=>s.choices[s.scene][k]===v);
  if(correct&&!n.solved.includes(s.scene))n.solved.push(s.scene);n.report={type:'check',correct};message=correct?'この模型の５つの特性を整理できました。':'観測、結果、番人、待ち時間と状態の区切りを見直しましょう。';
 }
 else return {ok:false,message:'環境の操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreAgentEnvironments(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>160)throw new RangeError('途中記録が不正です。');let s=createAgentEnvironments();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=agentEnvironmentsAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function agentEnvironmentsComplete(s){return Object.keys(agentScenes).every(k=>s.solved.includes(k));}
