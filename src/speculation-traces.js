export const sideChannelLevel={id:'workshop-speculation-traces',number:'494',kind:'speculation-traces',name:'消えない予測の足跡',tag:'投機実行と側信道',title:'取り消した道の足跡を調べよう',story:'魔導機械が予測を間違え、仮の作業を取り消しました。それでも棚に残る足跡から、見張り役に何が分かるか調べましょう。'};
export const traceModes={open:'仮の作業を進める',barrier:'確認まで仮の作業を止める'};
export const traceSecrets={red:'赤',blue:'青'};
export function speculationSnapshot(mode,secret,step){
 if(!Object.hasOwn(traceModes,mode)||!Object.hasOwn(traceSecrets,secret)||!Number.isInteger(step)||step<0||step>3)throw new RangeError('条件または手順が不正です。');
 const speculative=mode==='open'&&step>=1,hot=speculative?secret:null;
 return {tentative:mode==='open'&&step===1?'仮の値':null,committed:'変化なし',hot,measurement:step===3?{red:hot==='red'?1:5,blue:hot==='blue'?1:5}:null,expected:hot??'unknown'};
}
export function createSideChannel(){return {selected:'open',secret:'red',trials:Object.fromEntries(Object.keys(traceModes).map(m=>[m,Object.fromEntries(Object.keys(traceSecrets).map(k=>[k,{step:0,guess:null,checked:false}]))])),answer:null,checked:false};}
export function sideTrialComplete(mode,secret,t){return t.step===3&&t.checked&&t.guess===speculationSnapshot(mode,secret,3).expected;}
export function sideChannelComplete(s){return Object.keys(traceModes).every(m=>Object.keys(traceSecrets).every(k=>sideTrialComplete(m,k,s.trials[m][k])))&&s.answer==='residue'&&s.checked;}
export function restoreSideChannel(s){if(!s||!Object.hasOwn(traceModes,s.selected)||!Object.hasOwn(traceSecrets,s.secret)||!s.trials||![null,'residue','rollback','always'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const n=createSideChannel();n.selected=s.selected;n.secret=s.secret;n.answer=s.answer;n.checked=s.checked;for(const m of Object.keys(traceModes))for(const k of Object.keys(traceSecrets)){const t=s.trials[m]?.[k];if(!t||![null,'red','blue','unknown'].includes(t.guess)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');speculationSnapshot(m,k,t.step);n.trials[m][k]={step:t.step,guess:t.guess,checked:t.checked};}return n;}
