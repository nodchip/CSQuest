export const confidentialContainerLevel={id:'castle-confidential-container',number:'1090',kind:'confidential-container',name:'封印された容器への鍵',tag:'TEE とコンテナーの構成証明',title:'秘密を渡す相手を確かめる',story:'城は外部の封印室で動く容器に秘密を渡そうとしています。届いた証拠を確かめ、許可するか決めましょう。'};
export const confidentialCases={A:{name:'証拠 A',signature:true,nonce:true,image:true,tcb:true,audience:true},B:{name:'証拠 B',signature:true,nonce:true,image:false,tcb:true,audience:true},C:{name:'証拠 C',signature:true,nonce:false,image:true,tcb:true,audience:true},D:{name:'証拠 D',signature:false,nonce:true,image:true,tcb:true,audience:true},E:{name:'証拠 E',signature:true,nonce:true,image:true,tcb:false,audience:true},F:{name:'証拠 F',signature:true,nonce:true,image:true,tcb:true,audience:false}};
export const confidentialClaims={nonce:'今回の照会',image:'容器の識別値',tcb:'信頼基盤の状態',audience:'証拠の宛先'};
export function confidentialReplay(id,history){
 if(!Object.hasOwn(confidentialCases,id)||!Array.isArray(history)||history.length>6)throw new RangeError('証拠の記録が不正です');
 const c=confidentialCases[id],s={signatureChecked:false,checked:[],decision:null};
 for(const action of history){
  if(s.decision!==null)throw new RangeError('判定は終了しています');
  if(action==='signature'&&!s.signatureChecked){s.signatureChecked=true;continue;}
  if(Object.hasOwn(confidentialClaims,action)){
   if(!s.signatureChecked)throw new RangeError('先に証拠の署名を検証しましょう');if(!c.signature)throw new RangeError('署名が無効なため内容を信用できません');if(s.checked.includes(action))throw new RangeError('この項目は確認済みです');s.checked.push(action);continue;
  }
  if(action==='release'||action==='hold'){
   if(!s.signatureChecked)throw new RangeError('先に証拠の署名を検証しましょう');if(c.signature&&s.checked.length!==4)throw new RangeError('署名が有効なら４項目を確かめましょう');
   const release=c.signature&&Object.keys(confidentialClaims).every(k=>c[k]);if((action==='release')!==release)throw new RangeError(release?'すべての条件に一致しています。許可を検討しましょう':'確認できない条件があります。秘密を渡せません');s.decision=action;continue;
  }
  throw new RangeError('証拠の操作が不正です');
 }
 return s;
}
export function confidentialCreate(){return {case:'A',histories:Object.fromEntries(Object.keys(confidentialCases).map(k=>[k,[]])),reflection:null};}
export function confidentialDone(q){return Object.keys(confidentialCases).every(k=>confidentialReplay(k,q.histories[k]).decision!==null)&&q.reflection==='review';}
export function confidentialRestore(q){if(!q||!Object.hasOwn(confidentialCases,q.case)||!q.histories||![null,'review','guarantee'].includes(q.reflection))throw new RangeError('途中記録が不正です');const histories={};for(const k of Object.keys(confidentialCases)){confidentialReplay(k,q.histories[k]);histories[k]=[...q.histories[k]];}return {case:q.case,histories,reflection:q.reflection};}
