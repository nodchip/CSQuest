export const twoPhaseLevel={id:'village-two-phase-commit',number:'293',kind:'two-phase-commit',name:'二つの村の取引',tag:'分散取引と二相コミット',title:'二つの台帳に同じ決定を届けよう',story:'二つの村に分かれた台帳で取引を行います。調整役と二人の係が、確定か取消しかを一致させます。'};
export const twoPhaseCases={crash:{name:'準備後に調整役が停止',reject:false},reject:{name:'片方が準備を拒否',reject:true}};
export const twoPhaseActions={prepareA:'Ａに準備を頼む',prepareB:'Ｂに準備を頼む',crash:'調整役を停止する',wait:'準備済みの係を進める',recover:'調整役を復旧する',decide:'決定を記録する',deliverA:'Ａに決定を届ける',deliverB:'Ｂに決定を届ける'};
export function createTwoPhaseTrial(id){if(!Object.hasOwn(twoPhaseCases,id))throw new RangeError('試行が不正です');return {id,up:true,votes:{A:'未回答',B:'未回答'},participants:{A:'作業中',B:'作業中'},decision:null,blocked:false,history:[],message:'両方の係に準備を頼みましょう。'};}
export function twoPhaseStep(s,action){if(!Object.hasOwn(twoPhaseActions,action))throw new RangeError('操作が不正です');if(s.history.length>=30)return {...s,message:'操作の上限です。最初からやり直しましょう。'};const n={...s,votes:{...s.votes},participants:{...s.participants},history:[...s.history]};let message='';
 if(['prepareA','prepareB'].includes(action)&&s.up&&!s.decision){const id=action.at(-1);if(s.votes[id]!=='未回答')return {...s,message:'その係の回答は受け取っています。'};const reject=s.id==='reject'&&id==='B';n.votes[id]=reject?'拒否':'準備完了';n.participants[id]=reject?'拒否':'準備済み';message=reject?'Ｂは準備を拒否しました。':'係は準備の記録を残し、決定を待ちます。';}
 else if(action==='crash'&&s.id==='crash'&&s.up&&!s.decision&&Object.values(s.votes).every(v=>v==='準備完了')){n.up=false;message='調整役が決定を記録する前に停止しました。係は準備済みのままです。';}
 else if(action==='wait'&&!s.up&&s.participants.A==='準備済み'&&!s.blocked){n.blocked=true;message='Ａは決定を知らないため、自分だけで確定せず待ちます。';}
 else if(action==='recover'&&!s.up&&s.blocked){n.up=true;message='調整役が復旧しました。保存された回答を確かめて決定できます。';}
 else if(action==='decide'&&s.up&&!s.decision&&Object.values(s.votes).every(v=>v!=='未回答')&&(s.id!=='crash'||s.blocked)){n.decision=Object.values(s.votes).includes('拒否')?'取消':'確定';message=`調整役は「${n.decision}」を記録しました。まだ各係には届いていません。`;}
 else if(['deliverA','deliverB'].includes(action)&&s.up&&s.decision){const id=action.at(-1);if(['確定済み','取消済み'].includes(s.participants[id]))return {...s,message:'その係にはすでに決定が届いています。'};n.participants[id]=s.decision==='確定'?'確定済み':'取消済み';message=`${id} に「${s.decision}」を届けました。`;}
 else return {...s,message:'必要な前の操作を済ませてから進みましょう。'};
 n.history.push(action);n.message=message;return n;}
export function twoPhaseTrialComplete(s){const final=s.id==='crash'?'確定済み':'取消済み';return s.participants.A===final&&s.participants.B===final&&(s.id!=='crash'||s.blocked);}
export function createTwoPhase(){return {selected:'crash',trials:{crash:createTwoPhaseTrial('crash'),reject:createTwoPhaseTrial('reject')}};}
export function twoPhaseComplete(s){return Object.keys(twoPhaseCases).every(id=>twoPhaseTrialComplete(s.trials[id]));}
export function restoreTwoPhase(saved){if(!saved||!Object.hasOwn(twoPhaseCases,saved.selected)||!saved.histories)throw new RangeError('途中記録が不正です');const s=createTwoPhase();s.selected=saved.selected;for(const id of Object.keys(twoPhaseCases)){const history=saved.histories[id];if(!Array.isArray(history)||history.length>30)throw new RangeError('履歴が不正です');for(const action of history){const prev=s.trials[id],next=twoPhaseStep(prev,action);if(next.history.length!==prev.history.length+1)throw new RangeError('履歴が不正です');s.trials[id]=next;}}return s;}
