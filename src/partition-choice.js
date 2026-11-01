export const partitionPolicies={reply:'分館の値ですぐ応答',wait:'更新を確認できるまで待つ'};
export const partitionActions={write:'本館で更新を完了',read:'分館へ読み取りを依頼',heal:'伝令を復旧',deliver:'更新を分館へ届ける'};
const sequence=['write','read','heal','deliver','read'];
export function createPartitionChoice(){return {selected:'reply',histories:{reply:[],wait:[]},answers:{reply:null,wait:null},checked:{reply:false,wait:false}};}
export function partitionChoiceState(id,history){
 if(!Object.hasOwn(partitionPolicies,id)||!Array.isArray(history)||history.length>sequence.length)throw new RangeError('記録が不正です。');
 const s={primary:4,replica:4,partition:true,reads:[],message:'両方の台帳は４です。'};
 for(let i=0;i<history.length;i++){
  const action=history[i];if(action!==sequence[i])throw new RangeError('順序が不正です。');
  if(action==='write'){s.primary=3;s.message='本館で３への更新が完了しました。';}
  else if(action==='heal'){s.partition=false;s.message='伝令が復旧しました。';}
  else if(action==='deliver'){s.replica=s.primary;s.message='更新が分館に届きました。';}
  else {const result=s.partition&&id==='wait'?'wait':s.replica;s.reads.push(result);s.message=result==='wait'?'分館は更新を確認できず、応答を待っています。':`分館は ${result} と応答しました。`;}
 }
 return s;
}
export function partitionChoiceComplete(s){return Object.keys(partitionPolicies).every(id=>{const t=partitionChoiceState(id,s.histories[id]);return t.reads.length===2&&s.checked[id]&&s.answers[id]===(id==='wait'?'wait':'stale');});}
export function restorePartitionChoice(saved){
 if(!saved||!Object.hasOwn(partitionPolicies,saved.selected)||!saved.histories||!saved.answers||!saved.checked)throw new RangeError('記録が不正です。');
 const n=createPartitionChoice();n.selected=saved.selected;
 for(const id of Object.keys(partitionPolicies)){const h=saved.histories[id],a=saved.answers[id],c=saved.checked[id],t=partitionChoiceState(id,h);if(![null,'wait','stale','fresh'].includes(a)||typeof c!=='boolean'||(c&&(a===null||t.reads.length<2)))throw new RangeError('回答が不正です。');n.histories[id]=[...h];n.answers[id]=a;n.checked[id]=c;}
 return n;
}
