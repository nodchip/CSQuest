export const registerTransferLevel={id:'workshop-register-transfer',number:'924',kind:'register-transfer',name:'同じ刻の交換',tag:'レジスタ転送',title:'二つの記憶石を交換する',story:'二つの記憶石の中身を交換する指示が届きました。同じ刻で更新する方法と順に上書きする方法を比べましょう。'};
export const registerTransferModes={parallel:'同じ刻で更新',serial:'順に上書き'};
export const registerTransferCases={ten:[1,0],zeroOne:[0,1]};
export function registerTransferState(mode,initial,history){
 if(!Object.hasOwn(registerTransferModes,mode)||!Object.hasOwn(registerTransferCases,initial)||!Array.isArray(history)||history.length>3)throw new RangeError('記録が不正です。');
 let [a,b]=registerTransferCases[initial],nextA=null,nextB=null,phase=0;const trace=[];
 for(const action of history){
  if(mode==='parallel'&&action==='prepareA'&&nextA===null&&phase===0)nextA=b;
  else if(mode==='parallel'&&action==='prepareB'&&nextB===null&&phase===0)nextB=a;
  else if(mode==='parallel'&&action==='clock'&&nextA!==null&&nextB!==null&&phase===0){a=nextA;b=nextB;phase=2;}
  else if(mode==='serial'&&action==='writeA'&&phase===0){a=b;phase=1;}
  else if(mode==='serial'&&action==='writeB'&&phase===1){b=a;phase=2;}
  else throw new RangeError('その操作はできません。');
  trace.push({action,a,b,nextA,nextB});
 }
 return {a,b,nextA,nextB,trace,done:phase===2};
}
export function registerTransferCreate(){return {mode:'parallel',initial:'ten',histories:{'parallel:ten':[],'parallel:zeroOne':[],'serial:ten':[],'serial:zeroOne':[]},reflection:null};}
export function registerTransferStep(q,action){if(!['prepareA','prepareB','clock','writeA','writeB'].includes(action))throw new RangeError('操作が不正です。');const h=q.histories[`${q.mode}:${q.initial}`];try{registerTransferState(q.mode,q.initial,[...h,action]);h.push(action);return true;}catch{return false;}}
export function registerTransferComplete(q){return Object.keys(registerTransferModes).every(m=>Object.keys(registerTransferCases).every(i=>registerTransferState(m,i,q.histories[`${m}:${i}`]).done))&&q.reflection==='old';}
export function registerTransferRestore(q){if(!q||!Object.hasOwn(registerTransferModes,q.mode)||!Object.hasOwn(registerTransferCases,q.initial)||!q.histories||![null,'old','ordered','instant'].includes(q.reflection))throw new RangeError('記録が不正です。');const histories={};for(const m of Object.keys(registerTransferModes))for(const i of Object.keys(registerTransferCases)){const key=`${m}:${i}`;registerTransferState(m,i,q.histories[key]);histories[key]=[...q.histories[key]];}return {mode:q.mode,initial:q.initial,histories,reflection:q.reflection};}
