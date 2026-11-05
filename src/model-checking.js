export const modelLevel={id:'forge-model-checking',number:'242',kind:'model-checking',name:'二人の精霊と入口',tag:'状態探索と安全性',title:'すべての入り方を調べよう',story:'宝石の工房の部屋には、一度に一人しか入れません。二人の行動の順序を調べ、約束が破れる道を探しましょう。'};
export const modelModes={split:'確認と入室を別々にする',atomic:'入室時の確認と入室を一つにする'};
export const modelStages=['外','確認後','部屋の中','退出済み'];
const key=s=>`${s.a},${s.b}`;
function modelNext(mode,current,who){const other=who==='a'?'b':'a',stage=current[who];if(stage===3||(stage===0&&current[other]===2)||(stage===1&&(mode==='sealed'||mode==='atomic'&&current[other]===2)))return null;const next={a:current.a,b:current.b,path:[...current.path,`${who.toUpperCase()}：${modelStages[stage]} → ${modelStages[stage+1]}`]};next[who]++;return next;}
// Enumerate legal action sequences, including shorter ones, and return a bounded witness.
export function boundedModelWitness(mode,limit,goal='both'){
 if(!(Object.hasOwn(modelModes,mode)||mode==='sealed')||!['both','either'].includes(goal)||!Number.isInteger(limit)||limit<0||limit>4)throw new RangeError('探索条件が不正です。');
 let frontier=[{a:0,b:0,path:[]}];
 for(let depth=0;depth<=limit;depth++){
  const witness=frontier.find(s=>goal==='both'?s.a===2&&s.b===2:s.a===2||s.b===2);if(witness)return witness;
  if(depth<limit)frontier=frontier.flatMap(s=>['a','b'].map(who=>modelNext(mode,s,who)).filter(Boolean));
 }
 return null;
}
export function createModelTrial(mode){if(!Object.hasOwn(modelModes,mode))throw new RangeError('仕組みが不正です。');const initial={a:0,b:0,path:[]};return {mode,queue:[initial],seen:[key(initial)],current:null,status:'searching',counterexample:null,steps:0};}
export function expandModel(s){if(s.status!=='searching'||!s.queue.length)throw new RangeError('探索は終了しています。');const [current,...rest]=s.queue,queue=[...rest],seen=[...s.seen];let counterexample=null;
 for(const who of ['a','b']){const next=modelNext(s.mode,current,who);if(!next)continue;const k=key(next);if(seen.includes(k))continue;seen.push(k);if(next.a===2&&next.b===2){counterexample=next;break;}queue.push(next);}
 return {...s,current,queue,seen,counterexample,status:counterexample?'violation':queue.length?'searching':'safe',steps:s.steps+1};}
export function createModelCheck(){return {selected:'split',trials:Object.fromEntries(Object.keys(modelModes).map(mode=>[mode,createModelTrial(mode)])),bound:3,boundedChecked:false,boundedVariant:'selected',boundedGoal:'both'};}
export function modelCheckComplete(s){return s.trials.split.status==='violation'&&s.trials.atomic.status==='safe';}
export function restoreModelCheck(saved){if(!saved||!Object.hasOwn(modelModes,saved.selected)||!saved.trials||![0,1,2,3,4].includes(saved.bound??3)||typeof (saved.boundedChecked??false)!=='boolean'||!['selected','sealed'].includes(saved.boundedVariant??'selected')||!['both','either'].includes(saved.boundedGoal??'both'))throw new RangeError('途中記録が不正です。');const n=createModelCheck();n.selected=saved.selected;n.bound=saved.bound??3;n.boundedChecked=saved.boundedChecked??false;n.boundedVariant=saved.boundedVariant??'selected';n.boundedGoal=saved.boundedGoal??'both';for(const mode of Object.keys(modelModes)){const steps=saved.trials[mode]?.steps;if(!Number.isInteger(steps)||steps<0||steps>30)throw new RangeError('途中記録が不正です。');for(let i=0;i<steps;i++)n.trials[mode]=expandModel(n.trials[mode]);}return n;}
