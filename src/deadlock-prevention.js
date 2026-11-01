export const deadlockPreventionLevel={id:'forge-deadlock-prevention',number:'631',kind:'deadlock-prevention',name:'二つの鍵と行き詰まりの条件',tag:'デッドロックの必要条件と予防',title:'二つの鍵の約束を選ぼう',story:'二人の精霊は赤と青の鍵を両方使います。鍵の取り方を変え、行き詰まりを防ぐ約束を考えましょう。'};
export const preventionModes={opposing:'逆の順に取る',ordered:'同じ順に取る',atomic:'両方まとめて取る'};
export const preventionConditions={exclusive:'鍵を同時に共有できない',hold:'鍵を持ったまま別の鍵を待つ',noPreempt:'持ち主から鍵を強制的に取り上げない',cycle:'互いに相手の鍵を待つ輪がある'};
export function createPreventionTrial(mode){if(!Object.hasOwn(preventionModes,mode))throw new RangeError('方式が不正です。');return {mode,owners:{red:null,blue:null},workers:{A:{stage:0,waiting:false},B:{stage:0,waiting:false}},waited:false,status:'playing',history:[]};}
export function stepPrevention(state,who){
 if(!['A','B'].includes(who)||state.status!=='playing'||state.workers[who].stage===3)return null;
 const s=structuredClone(state),w=s.workers[who],order=s.mode==='opposing'&&who==='B'?['blue','red']:['red','blue'];
 if(w.stage===2){for(const key of ['red','blue'])if(s.owners[key]===who)s.owners[key]=null;w.stage=3;w.waiting=false;}
 else if(s.mode==='atomic'){
  if(s.owners.red!==null||s.owners.blue!==null){if(w.waiting)return null;w.waiting=true;s.waited=true;}
  else{s.owners.red=who;s.owners.blue=who;w.stage=2;w.waiting=false;}
 }else{const key=order[w.stage];if(s.owners[key]!==null){if(w.waiting)return null;w.waiting=true;s.waited=true;}else{s.owners[key]=who;w.stage++;w.waiting=false;}}
 if(s.workers.A.waiting&&s.workers.B.waiting)s.status='deadlocked';else if(s.workers.A.stage===3&&s.workers.B.stage===3)s.status='done';s.history.push(who);return s;
}
export function replayPrevention(mode,history){if(!Array.isArray(history)||history.length>20)throw new RangeError('履歴が不正です。');let s=createPreventionTrial(mode);for(const who of history){const n=stepPrevention(s,who);if(!n)throw new RangeError('履歴が不正です。');s=n;}return s;}
export function createDeadlockPrevention(){return {selected:'opposing',histories:{opposing:[],ordered:[],atomic:[]},conditions:[],answer:null,checked:false};}
export function preventionTrialComplete(mode,t){return mode==='opposing'?t.status==='deadlocked':t.status==='done'&&t.waited;}
export function deadlockPreventionComplete(s){return Object.keys(preventionModes).every(m=>preventionTrialComplete(m,replayPrevention(m,s.histories[m])))&&Object.keys(preventionConditions).every(k=>s.conditions.includes(k))&&s.answer==='necessary'&&s.checked;}
export function restoreDeadlockPrevention(s){if(!s||!Object.hasOwn(preventionModes,s.selected)||!s.histories||!Array.isArray(s.conditions)||new Set(s.conditions).size!==s.conditions.length||s.conditions.some(k=>!Object.hasOwn(preventionConditions,k))||![null,'necessary','sufficient','fair'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const r=createDeadlockPrevention();r.selected=s.selected;r.conditions=[...s.conditions];r.answer=s.answer;r.checked=s.checked;for(const mode of Object.keys(preventionModes)){replayPrevention(mode,s.histories[mode]);r.histories[mode]=[...s.histories[mode]];}return r;}
