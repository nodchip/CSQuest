export const analysisForgeLevel={id:'guild-analysis-forge',number:'657',kind:'analysis-forge',name:'警告の鏡と試練の灯',tag:'静的解析と動的試験',title:'魔法の門を二つの道具で調べよう',story:'祭りに続く三つの門を調べます。術式を読む鏡と、実際に通して調べる試練の灯を使い、警告を確かめて門を直しましょう。'};
export const analysisGates=['unsafe','helper','boundary'];
const inputs={unsafe:['normal','zero'],helper:['normal','zero'],boundary:['normal','edge']};
export function createAnalysisForge(){return {gate:'unsafe',fixed:{unsafe:false,boundary:false},seen:[],report:null,answers:{warning:null,clean:null},checked:false,history:[]};}
export function analysisResult(gate,fixed,input){
 if(!analysisGates.includes(gate)||!inputs[gate].includes(input))throw new RangeError('門か試す入力が不正です。');
 if(gate==='boundary'){const value=input==='edge'?5:3,actual=value<=(fixed?5:4);return {actual:actual?'通す':'拒む',expected:'通す',pass:actual};}
 if(input==='normal')return {actual:'6',expected:'6',pass:true};
 const handled=gate==='helper'||fixed;return {actual:handled?'安全に断る':'停止する',expected:'安全に断る',pass:handled};
}
export function analysisAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=128)return {ok:false,message:'操作記録がいっぱいです。やり直してください。'};
 const n={...s,fixed:{...s.fixed},seen:[...s.seen],answers:{...s.answers},history:[...s.history],checked:false};let message='';
 const mark=k=>{if(!n.seen.includes(k))n.seen.push(k);};
 if(action.startsWith('gate:')&&analysisGates.includes(action.slice(5))){n.gate=action.slice(5);n.report=null;message='調べる門を切り替えました。';}
 else if(action==='static'){
  const warning=s.gate!=='boundary'&&!(s.gate==='unsafe'&&s.fixed.unsafe);
  n.report={kind:'static',warning};mark(`${s.gate}-static${s.fixed[s.gate]?'-fixed':''}`);
  message=warning?'鏡は「割り算の前に、その場でゼロを確認していない」と警告しました。':'鏡はこの規則に該当する警告を出しませんでした。';
 }
 else if(action.startsWith('test:')&&inputs[s.gate].includes(action.slice(5))){
  const input=action.slice(5),fixed=!!s.fixed[s.gate],result=analysisResult(s.gate,fixed,input);n.report={kind:'test',input,...result};mark(`${s.gate}-${input}${fixed?'-fixed':''}`);
  message=`期待：${result.expected} ／ 実際：${result.actual}。${result.pass?'一致しました。':'一致しません。'}`;
 }
 else if(action==='fix'&&s.gate!=='helper'&&!s.fixed[s.gate]){n.fixed[s.gate]=true;n.report=null;message=s.gate==='unsafe'?'割り算の前にゼロを断る仕組みを足しました。再び調べましょう。':'上限を５人まで含むように直しました。境界を再び試しましょう。';}
 else if(action==='undo'&&s.gate!=='helper'&&s.fixed[s.gate]){n.fixed[s.gate]=false;n.report=null;message='この門の修復を戻しました。';}
 else if(['warning:review','warning:always','warning:ignore'].includes(action)){n.answers.warning=action.slice(8);message='警告の扱いを選びました。';}
 else if(['clean:limited','clean:perfect','clean:fail'].includes(action)){n.answers.clean=action.slice(6);message='警告がない場合の意味を選びました。';}
 else if(action==='check'){n.checked=true;message='記録と答えを確かめました。';}
 else return {ok:false,message:'門と操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreAnalysisForge(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>128)throw new RangeError('途中記録が不正です。');let s=createAnalysisForge();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=analysisAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function analysisForgeComplete(s){return ['unsafe-static','unsafe-normal','unsafe-zero','unsafe-static-fixed','unsafe-zero-fixed','helper-static','helper-zero','boundary-static','boundary-normal','boundary-edge','boundary-edge-fixed'].every(k=>s.seen.includes(k))&&s.answers.warning==='review'&&s.answers.clean==='limited'&&s.checked;}
