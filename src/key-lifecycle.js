export const keyLifecycleLevel={id:'castle-key-lifecycle',number:'609',kind:'key-lifecycle',name:'守り手の鍵の一生',tag:'鍵管理と漏えい対応',title:'鍵の旅を守り抜こう',story:'ミラとリオは共通の鍵で伝令を守ります。鍵を作り、渡し、保管し、漏えい後の手当てと廃棄を考えましょう。'};
export const keyLifecycleChoices={generation:['random','known'],delivery:['protected','public'],storage:['restricted','open'],response:['rotate','reuse'],disposal:['both','primary']};
export function evaluateKeyLifecycle(policy){
 if(!policy||Object.entries(keyLifecycleChoices).some(([k,values])=>!values.includes(policy[k])))throw new RangeError('鍵管理の選択が不正です');
 const causes=[];
 if(policy.generation==='known')causes.push('known');
 if(policy.delivery==='public')causes.push('public');
 if(policy.storage==='open')causes.push('open');
 return {before:causes.length>0,causes,oldAfter:true,newAfter:policy.response==='reuse',localOldCopies:policy.disposal==='both'?0:1,stolenCopyRemains:true};
}
export function createKeyLifecycle(){return {policy:{generation:'random',delivery:'protected',storage:'restricted',response:'rotate',disposal:'both'},beforeGuess:null,afterGuess:null,copiesGuess:null,observed:[],answer:null,checked:false};}
export function keyLifecycleComplete(s){return ['protected','known','public','open','rotate','reuse','both','primary'].every(x=>s.observed.includes(x))&&s.answer==='lifecycle'&&s.checked;}
export function restoreKeyLifecycle(s){
 if(!s||!s.policy||Object.entries(keyLifecycleChoices).some(([k,values])=>!values.includes(s.policy[k]))||![null,true,false].includes(s.beforeGuess)||![null,true,false].includes(s.afterGuess)||![null,0,1].includes(s.copiesGuess)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(x=>!['protected','known','public','open','rotate','reuse','both','primary'].includes(x))||![null,'lifecycle','rotateAll','deleteStolen'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('保存データが不正です');
 return {...s,policy:{...s.policy},observed:[...s.observed]};
}
