export const typeSafetyLevel={id:'workshop-type-safety',number:'766',kind:'type-safety',name:'壊れない変身の印',tag:'型の進行と保存',title:'変身の約束を調べよう',story:'工房の変身機は品を一手ずつ変えます。約束の異なる機械を調べ、安全に変身できる条件を探しましょう。'};

// Terms are fixed closed expressions: numbers, booleans, successor, and if.
export const safetyCases={
 normal:{name:'正しい機械',term:['succ',['if',true,0,1]],rule:'normal',description:'灯りが点なら０、消なら１を選び、その結果に１を足します。'},
 stuck:{name:'型が合わない品',term:['succ',true],rule:'normal',description:'灯りに１を足そうとします。'},
 conservative:{name:'使わない道の不一致',term:['if',true,0,false],rule:'normal',description:'点なら０、消なら消灯を選びます。'},
 brokenPreservation:{name:'型を変える故障',term:['succ',0],rule:'wrong',description:'故障した機械は「０に１を足す」と点灯を返します。'},
 brokenProgress:{name:'動かない故障',term:['succ',0],rule:'stopped',description:'故障した機械には「０に１を足す」動作がありません。'}
};
export function safetyType(term){
 if(typeof term==='number')return 'number';
 if(typeof term==='boolean')return 'light';
 if(term[0]==='succ')return safetyType(term[1])==='number'?'number':null;
 if(term[0]==='if'){const c=safetyType(term[1]),a=safetyType(term[2]),b=safetyType(term[3]);return c==='light'&&a!==null&&a===b?a:null;}
 throw new RangeError('式が不正です。');
}
export function safetyValue(term){return typeof term==='number'||typeof term==='boolean';}
export function safetyStep(term,rule='normal'){
 if(safetyValue(term))return null;
 if(term[0]==='succ'){
  const x=term[1];
  if(typeof x==='number')return rule==='stopped'&&x===0?null:rule==='wrong'&&x===0?true:x+1;
  const next=safetyStep(x,rule);return next===null?null:['succ',next];
 }
 if(term[0]==='if'){
  const c=term[1];if(typeof c==='boolean')return c?term[2]:term[3];
  const next=safetyStep(c,rule);return next===null?null:['if',next,term[2],term[3]];
 }
 throw new RangeError('式が不正です。');
}
export function safetyCurrent(id,steps){let term=structuredClone(safetyCases[id].term);for(let i=0;i<steps;i++){term=safetyStep(term,safetyCases[id].rule);if(term===null)throw new RangeError('途中記録が不正です。');}return term;}
export function safetyStatus(id,steps){const term=safetyCurrent(id,steps);return safetyValue(term)?'value':safetyStep(term,safetyCases[id].rule)===null?'stuck':'step';}
export function safetyTrial(){return {steps:0,observed:false,choice:''};}
export function safetyCreate(){return {selected:'normal',trials:Object.fromEntries(Object.keys(safetyCases).map(id=>[id,safetyTrial()])),progress:'',preservation:'',checked:false};}
export function safetyObserve(id,t){if(t.choice!==safetyStatus(id,t.steps))return false;t.observed=true;return true;}
export function safetyAdvance(id,t){if(!t.observed||safetyStatus(id,t.steps)!=='step')return false;t.steps++;t.observed=false;t.choice='';return true;}
export function safetyComplete(s){return Object.keys(safetyCases).every(id=>{const t=s.trials[id];return t.observed&&safetyStatus(id,t.steps)!=='step';})&&s.progress==='value-or-step'&&s.preservation==='same-type'&&s.checked;}
export function safetyRestore(s){
 if(!s||!Object.hasOwn(safetyCases,s.selected)||!s.trials||!['','value-or-step','always-step','any-term'].includes(s.progress)||!['','same-type','same-value','always-number'].includes(s.preservation)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 const out=safetyCreate();out.selected=s.selected;out.progress=s.progress;out.preservation=s.preservation;out.checked=s.checked;
 for(const id of Object.keys(safetyCases)){const t=s.trials[id];if(!t||!Number.isInteger(t.steps)||t.steps<0||t.steps>5||typeof t.observed!=='boolean'||!['','step','value','stuck'].includes(t.choice))throw new RangeError('途中記録が不正です。');safetyCurrent(id,t.steps);if(t.observed&&t.choice!==safetyStatus(id,t.steps))throw new RangeError('途中記録が不正です。');out.trials[id]={steps:t.steps,observed:t.observed,choice:t.choice};}return out;
}
export function safetyLabel(term){if(typeof term==='number')return String(term);if(typeof term==='boolean')return term?'点灯':'消灯';if(term[0]==='succ')return `１を足す（${safetyLabel(term[1])}）`;return `もし ${safetyLabel(term[1])} なら ${safetyLabel(term[2])}、そうでなければ ${safetyLabel(term[3])}`;}
