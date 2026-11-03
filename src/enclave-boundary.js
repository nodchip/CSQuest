export const enclaveBoundaryLevel={id:'castle-enclave-boundary',number:'1091',kind:'enclave-boundary',name:'封印室の入口と出口',tag:'エンクレーブと信頼境界',title:'封印室への出入りを守る',story:'封印室の中の処理が、外からの依頼を読み、結果を返します。入口と出口で何が起きるか調べましょう。'};
export const enclaveModes={direct:'外側を再読取',copy:'内部に写して使う',raw:'秘密そのものを返す',threshold:'条件に合うかだけ返す'};
export function enclaveReplay(mode,history){
 if(!Object.hasOwn(enclaveModes,mode)||!Array.isArray(history)||history.length>4)throw new RangeError('記録が不正です');
 const input=mode==='direct'||mode==='copy',s={outside:3,inside:null,validated:false,changed:false,used:null,computed:false,output:null};
 for(const action of history){
  if(input){
   if(action==='copy'&&mode==='copy'&&s.inside===null&&!s.validated){s.inside=s.outside;continue;}
   if(action==='validate'&&!s.validated&&(mode==='direct'||s.inside!==null)){const v=mode==='copy'?s.inside:s.outside;if(v>5)throw new RangeError('検査に通りません');s.validated=true;continue;}
   if(action==='change'&&s.validated&&!s.changed){s.outside=9;s.changed=true;continue;}
   if(action==='use'&&s.changed&&s.used===null){s.used=mode==='copy'?s.inside:s.outside;continue;}
  }else{
   if(action==='compute'&&!s.computed){s.computed=true;continue;}
   if(action==='export'&&s.computed&&s.output===null){s.output=mode==='raw'?42:'はい';continue;}
  }
  throw new RangeError('先に必要な操作を行いましょう');
 }
 return {...s,done:input?s.used!==null:s.output!==null};
}
export function enclaveCreate(){return {mode:'direct',histories:Object.fromEntries(Object.keys(enclaveModes).map(m=>[m,[]])),inputReflection:null,outputReflection:null};}
export function enclaveDone(q){return Object.keys(enclaveModes).every(m=>enclaveReplay(m,q.histories[m]).done)&&q.inputReflection==='copy'&&q.outputReflection==='limited';}
export function enclaveRestore(q){if(!q||!Object.hasOwn(enclaveModes,q.mode)||!q.histories||![null,'copy','trust'].includes(q.inputReflection)||![null,'limited','nothing'].includes(q.outputReflection))throw new RangeError('途中記録が不正です');const histories={};for(const m of Object.keys(enclaveModes)){enclaveReplay(m,q.histories[m]);histories[m]=[...q.histories[m]];}return {mode:q.mode,histories,inputReflection:q.inputReflection,outputReflection:q.outputReflection};}
