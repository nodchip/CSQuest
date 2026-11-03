export const safetyConditionsLevel={id:'castle-safety-conditions',number:'1076',kind:'safety-conditions',name:'水門の三つの安全条件',tag:'安全重視システムと試験',title:'水門が開く条件を確かめる',story:'水門は開門要求、水位が安全、センサーが有効の３条件を確認します。条件を変えて門を試し、不具合を直しましょう。'};
export const safetyCases={good:'正しい門',sensor:'有効確認を飛ばす門',level:'水位確認を飛ばす門',stuck:'常に開く門'};
export const safetyBaseMasks=[7,6,5,3];
export function safetyOutput(id,mask,repaired=false){
 if(!Object.hasOwn(safetyCases,id)||!Number.isInteger(mask)||mask<0||mask>7||typeof repaired!=='boolean')throw new RangeError('試験条件が不正です。');
 const request=!!(mask&1),level=!!(mask&2),sensor=!!(mask&4),expected=request&&level&&sensor;
 const actual=id==='good'||repaired?expected:id==='sensor'?request&&level:id==='level'?request&&sensor:true;
 return {request,level,sensor,expected,actual};
}
export function safetyReplay(id,history){
 if(!Object.hasOwn(safetyCases,id)||!Array.isArray(history)||history.length>40)throw new RangeError('試験記録が不正です。');
 const s={tested:[],failed:[],repaired:false,rechecked:false,last:null};
 for(const event of history){
  if(!event||typeof event!=='object')throw new RangeError('試験記録が不正です。');
  if(event.type==='test'){
   const r=safetyOutput(id,event.mask,s.repaired);if(typeof event.guess!=='boolean'||event.guess!==r.actual)throw new RangeError('予想の記録が不正です。');
   if(!s.tested.includes(event.mask))s.tested.push(event.mask);
   if(!s.repaired&&r.actual!==r.expected&&!s.failed.includes(event.mask))s.failed.push(event.mask);
   if(s.repaired&&s.failed.includes(event.mask)&&r.actual===r.expected)s.rechecked=true;
   s.last={mask:event.mask,...r};
  }else if(event.type==='repair'){
   if(id==='good'||s.repaired||!s.failed.length)throw new RangeError('先に不具合を発見しましょう。');s.repaired=true;s.last=null;
  }else throw new RangeError('試験記録が不正です。');
 }
 return s;
}
export function safetyCaseDone(id,history){const r=safetyReplay(id,history);return id==='good'?safetyBaseMasks.every(x=>r.tested.includes(x)):r.failed.length>0&&r.repaired&&r.rechecked;}
export function safetyCreate(){return {current:'good',mask:7,guess:null,histories:Object.fromEntries(Object.keys(safetyCases).map(id=>[id,[]])),reflection:null};}
export function safetyDone(q){return Object.keys(safetyCases).every(id=>safetyCaseDone(id,q.histories[id]))&&q.reflection==='limits';}
export function safetyRestore(q){
 if(!q||!Object.hasOwn(safetyCases,q.current)||!Number.isInteger(q.mask)||q.mask<0||q.mask>7||![null,true,false].includes(q.guess)||!q.histories||![null,'limits','guarantee'].includes(q.reflection))throw new RangeError('途中記録が不正です。');
 const histories={};for(const id of Object.keys(safetyCases)){safetyReplay(id,q.histories[id]);histories[id]=q.histories[id].map(e=>({...e}));}return {...q,histories};
}
