export const logCheckpointLevel={id:'archive-log-checkpoint',number:'738',kind:'log-checkpoint',name:'書庫の復旧のしおり',tag:'ログ構造と障害復旧',title:'確かな記録へしおりを移す',story:'追記する書庫で新しい巻物を保存し、中断後も確かな版へ戻れるようにしましょう。'};
export const checkpointActions=['data','map','checkpoint','reclaim'];
export function checkpointCreate(){return {step:0,seen:[],guess:'',answer:'',checked:false};}
export function checkpointRecover(step){if(!Number.isInteger(step)||step<0||step>4)throw new RangeError('工程が不正です。');return step<3?'old':'new';}
export function checkpointAdvance(s,action){checkpointRestore(s);if(s.step>=4||checkpointActions[s.step]!==action)return false;s.step++;s.guess='';return true;}
export function checkpointObserve(s){checkpointRestore(s);if(s.guess!==checkpointRecover(s.step))return false;if(!s.seen.includes(s.step))s.seen.push(s.step);return true;}
export function checkpointComplete(s){return s.seen.length===5&&s.answer==='order'&&s.checked;}
export function checkpointRestore(s){if(!s||!Number.isInteger(s.step)||s.step<0||s.step>4||!Array.isArray(s.seen)||new Set(s.seen).size!==s.seen.length||s.seen.some(x=>!Number.isInteger(x)||x<0||x>4)||!['','old','new'].includes(s.guess)||!['','order','early','backup'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,seen:[...s.seen]};}
