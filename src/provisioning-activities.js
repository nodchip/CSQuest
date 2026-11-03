export const provisionLevel={id:'forge-provisioning-activities',number:'1116',kind:'provisioning-activities',name:'二人の精霊を迎える工房',tag:'活動の準備と資源管理',title:'仕事の場と通信路を整える',story:'二つの工房に精霊を配置して小計を集めます。準備を自分で行う場合と、管理役に依頼する場合を比べましょう。'};
export const provisionModes={manual:'自分で準備',managed:'管理役に依頼'};
export const provisionActions={channel:'通信路を用意',allocA:'甲の資源を確保',allocB:'乙の資源を確保',startA:'甲を開始',startB:'乙を開始',apply:'二人の準備を依頼',reconcile:'管理役が再調整',expand:'資源を１増やす',finishA:'甲の小計２を受け取る',finishB:'乙の小計３を受け取る',join:'小計を集める',cleanup:'資源を返す'};
export function provisionReplay(mode,history){
 if(!Object.hasOwn(provisionModes,mode)||!Array.isArray(history)||history.length>30)throw new RangeError('準備の記録が不正です。');const s={capacity:1,channel:false,allocated:[],running:[],finished:[],applied:false,shortage:false,joined:false,done:false,last:''};
 for(const a of history){if(!Object.hasOwn(provisionActions,a)||s.done)throw new RangeError('操作が不正です。');
  if(a==='expand'&&s.capacity===1){s.capacity=2;s.last='資源を１増やしました。';}
  else if(mode==='manual'&&a==='channel'&&!s.channel){s.channel=true;s.last='通信路を用意しました。';}
  else if(mode==='manual'&&['allocA','allocB'].includes(a)){const w=a.at(-1);if(s.allocated.includes(w))throw new RangeError('その精霊の資源は確保済みです。');if(s.allocated.length>=s.capacity){s.shortage=true;s.last='空き資源がなく、確保できません。';}else{s.allocated.push(w);s.last=`${w}の資源を確保しました。`;}}
  else if(mode==='manual'&&['startA','startB'].includes(a)){const w=a.at(-1);if(!s.channel||!s.allocated.includes(w)||s.running.includes(w))throw new RangeError('通信路とその精霊の資源を先に用意しましょう。');s.running.push(w);s.last=`${w}を開始しました。`;}
  else if(mode==='managed'&&a==='apply'&&!s.applied){s.applied=true;s.channel=true;s.allocated.push('A');s.running.push('A');if(s.capacity>=2){s.allocated.push('B');s.running.push('B');s.last='二人の準備ができました。';}else{s.shortage=true;s.last='甲を開始しましたが、乙は資源不足で待機中です。';}}
  else if(mode==='managed'&&a==='reconcile'&&s.applied&&!s.running.includes('B')){if(s.allocated.length>=s.capacity){s.shortage=true;s.last='まだ資源が足りません。';}else{s.allocated.push('B');s.running.push('B');s.last='管理役が乙を開始しました。';}}
  else if(['finishA','finishB'].includes(a)){const w=a.at(-1);if(!s.running.includes(w)||s.finished.includes(w))throw new RangeError('その精霊の仕事を先に開始しましょう。');s.finished.push(w);s.last=`${w}の小計を受け取りました。`;}
  else if(a==='join'&&!s.joined&&s.finished.length===2){s.joined=true;s.last='小計２と３を集め、合計５になりました。';}
  else if(a==='cleanup'&&s.joined){s.allocated=[];s.running=[];s.channel=false;s.done=true;s.last='資源と通信路を返しました。';}
  else throw new RangeError('先に必要な準備や仕事を確認しましょう。');
 }
 return s;
}
export function provisionCreate(){return {mode:'manual',runs:{manual:[],managed:[]},answer:null,checked:false};}
export function provisionAct(q,a){const h=[...q.runs[q.mode],a],s=provisionReplay(q.mode,h);q.runs[q.mode]=h;return s;}
export function provisionDone(q){return Object.keys(provisionModes).every(k=>{const s=provisionReplay(k,q.runs[k]);return s.shortage&&s.done;})&&q.answer==='resources'&&q.checked;}
export function provisionRestore(q){if(!q||!Object.hasOwn(provisionModes,q.mode)||!q.runs||![null,'resources','instant','none'].includes(q.answer)||typeof q.checked!=='boolean')throw new RangeError('途中記録が不正です。');const r=provisionCreate();r.mode=q.mode;r.answer=q.answer;r.checked=q.checked;for(const k of Object.keys(provisionModes)){provisionReplay(k,q.runs[k]);r.runs[k]=[...q.runs[k]];}return r;}
