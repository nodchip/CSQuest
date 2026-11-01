import {createPartitionChoice,restorePartitionChoice,partitionChoiceComplete} from './partition-choice.js';
export const replicaLevel={id:'village-replica-lag',number:'190',kind:'replica-lag',name:'二つの村の在庫台帳',tag:'複製と更新の遅れ',title:'届く前の写しを調べよう',story:'薬師の在庫台帳は本館と分館に複製されています。伝令が途切れたとき、二つの台帳から何が読めるか調べましょう。'};
export const replicaActions={write:'本館の在庫を３に更新',readPrimary:'本館を読む',readReplica:'分館を読む',deliver:'更新を届ける',heal:'伝令を復旧する'};
export function createReplica(){return {primary:4,replica:4,partition:true,pending:false,flags:{wrote:false,stale:false,primaryRead:false,failedDelivery:false,delivered:false,fresh:false},history:[],choice:createPartitionChoice(),message:'最初の在庫は両方とも４。伝令は途切れています。'};}
export function replicaStep(s,action){if(!Object.hasOwn(replicaActions,action))throw new RangeError('操作が不正です。');if(s.history.length>=1000)return {...s,message:'記録の上限です。最初からやり直しましょう。'};const n={...s,flags:{...s.flags},history:s.history.slice()};
 if(action==='write'){if(s.flags.wrote)return {...s,message:'この例では更新は一度だけです。'};n.primary=3;n.pending=true;n.flags.wrote=true;n.message='本館を３に更新しました。分館にはまだ届いていません。';}
 else if(action==='readPrimary'){n.message=`本館から ${s.primary} を読みました。`;if(s.flags.wrote)n.flags.primaryRead=true;}
 else if(action==='readReplica'){n.message=`分館から ${s.replica} を読みました。`;if(s.flags.wrote&&s.replica===4)n.flags.stale=true;if(s.flags.delivered&&s.replica===3)n.flags.fresh=true;}
 else if(action==='deliver'){if(!s.pending)return {...s,message:'届ける更新がありません。'};if(s.partition){n.flags.failedDelivery=true;n.message='伝令が途切れているため、更新は届きません。';}else{n.replica=s.primary;n.pending=false;n.flags.delivered=true;n.message='更新が分館へ届きました。';}}
 else if(action==='heal'){if(!s.partition)return {...s,message:'伝令はすでに復旧しています。'};n.partition=false;n.message='伝令が復旧しました。待っている更新はまだ自動では届きません。';}
 n.history.push(action);return n;}
export function replicaComplete(s){return Object.values(s.flags).every(Boolean)&&partitionChoiceComplete(s.choice);}
export function restoreReplica(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>1000)throw new RangeError('途中記録が不正です。');let s=createReplica();for(const action of saved.history){const n=replicaStep(s,action);if(n.history.length!==s.history.length+1)throw new RangeError('履歴が不正です。');s=n;}if(saved.choice!==undefined)s.choice=restorePartitionChoice(saved.choice);return s;}
